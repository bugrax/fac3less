'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.WorkflowController = void 0));
const orchestration_1 = require('../../services/ai/orchestration/index'),
  openrouter_1 = require('../../services/ai/llm/providers/openrouter/index'),
  replicate_1 = require('../../services/ai/video/providers/replicate/index'),
  ReplicateImageClient_1 = require('../../services/ai/image/providers/replicate/ReplicateImageClient'),
  ai_1 = require('../../../config/ai/index'),
  workflow_sse_routes_1 = require('../routes/workflow.sse.routes'),
  logger_1 = require('../../utils/logger');
class WorkflowController {
  workflowExecutor;
  llmClient;
  videoClient;
  imageClient;
  constructor() {
    ((this.workflowExecutor = new orchestration_1.WorkflowExecutor()),
      (this.llmClient = new openrouter_1.OpenRouterClient({
        apiKey: ai_1.openRouterConfig.apiKey || void 0,
      })),
      (this.videoClient = new replicate_1.ReplicateClient({
        apiKey: ai_1.replicateConfig.apiToken || void 0,
      })),
      (this.imageClient = new ReplicateImageClient_1.ReplicateImageClient()));
  }
  async executeWorkflow(e, r) {
    try {
      const { workflow: o, initialInput: t } = e.body;
      if ((o?.nodes && o.nodes.forEach(e => {}), !o || !t))
        return void r.status(400).json({
          success: !1,
          error: 'Workflow definition and initial input are required',
        });
      const s = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      (r.json({
        success: !0,
        data: {
          executionId: s,
          status: 'started',
          message:
            'Workflow execution started. Use SSE endpoint for real-time updates.',
        },
      }),
        setTimeout(async () => {
          try {
            await this.workflowExecutor.executeWorkflowAsync(
              o,
              t,
              { workflowId: o.id, nodeId: '', userId: e.headers['x-user-id'] },
              {
                executionId: s,
                onProgress: (e, r, o) => {
                  const t = new Map();
                  (o.forEach((e, r) => {
                    t.set(r, e);
                  }),
                    (0, workflow_sse_routes_1.sendProgressUpdate)(e, r, t));
                },
              }
            );
          } catch (e) {
            (logger_1.logger.error('Async workflow execution error:', e),
              logger_1.logger.error('Error details:', {
                executionId: s,
                errorMessage: e instanceof Error ? e.message : 'Unknown error',
                errorStack: e instanceof Error ? e.stack : void 0,
                errorType: e?.constructor?.name,
              }));
            try {
              (0, workflow_sse_routes_1.sendProgressUpdate)(
                s,
                100,
                new Map([
                  [
                    'error',
                    {
                      state: 'failed',
                      error:
                        e instanceof Error
                          ? e.message
                          : 'Workflow execution failed',
                    },
                  ],
                ])
              );
            } catch (e) {
              logger_1.logger.error('Failed to send error via SSE:', e);
            }
          }
        }, 500));
    } catch (e) {
      (logger_1.logger.error('Workflow execution error:', e),
        r.status(500).json({
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to execute workflow',
        }));
    }
  }
  async getExecutionStatus(e, r) {
    try {
      const { executionId: o } = e.params,
        t = this.workflowExecutor.getExecutionResult(o);
      if (!t)
        return void r
          .status(404)
          .json({ success: !1, error: 'Execution not found' });
      r.json({
        success: !0,
        data: {
          executionId: t.workflowId,
          status: t.status,
          startTime: t.startTime,
          endTime: t.endTime,
          error: t.error,
          nodeResults: Array.from(t.nodeResults.entries()).map(([e, r]) => ({
            nodeId: e,
            success: r.success,
            error: r.error,
            metadata: r.metadata,
          })),
        },
      });
    } catch (e) {
      (logger_1.logger.error('Get execution status error:', e),
        r.status(500).json({
          success: !1,
          error:
            e instanceof Error ? e.message : 'Failed to get execution status',
        }));
    }
  }
  async cancelWorkflow(e, r) {
    const { executionId: o } = e.params;
    try {
      this.workflowExecutor.cancelExecution(o)
        ? r.json({ success: !0, message: 'Workflow execution cancelled' })
        : r.status(404).json({
            success: !1,
            error: 'Execution not found or already completed',
          });
    } catch (e) {
      (logger_1.logger.error('Error cancelling workflow:', e),
        r
          .status(500)
          .json({ success: !1, error: 'Failed to cancel workflow' }));
    }
  }
  async listLLMModels(e, r) {
    try {
      if (!this.llmClient) throw new Error('LLM client not initialized');
      const e = await this.llmClient.listModels();
      r.json({ success: e.success, data: e.data, metadata: e.metadata });
    } catch (e) {
      (logger_1.logger.error('List LLM models error:', e),
        logger_1.logger.error('Error details:', {
          message: e instanceof Error ? e.message : 'Unknown error',
          stack: e instanceof Error ? e.stack : 'No stack trace',
          errorType: e?.constructor?.name,
          llmClientExists: !!this.llmClient,
          apiKeyPresent: !!ai_1.openRouterConfig.apiKey,
        }),
        r.status(500).json({
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to list LLM models',
        }));
    }
  }
  async listVideoModels(e, r) {
    try {
      const e = await this.videoClient.listModels();
      r.json({ success: e.success, data: e.data, metadata: e.metadata });
    } catch (e) {
      (logger_1.logger.error('List video models error:', e),
        r.status(500).json({
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to list video models',
        }));
    }
  }
  async listImageModels(e, r) {
    try {
      if (!this.imageClient)
        return void r.json({
          success: !0,
          data: [],
          metadata: { count: 0, providers: [] },
        });
      const e = this.imageClient.getAvailableModels();
      if (!e)
        return void r.json({
          success: !0,
          data: [],
          metadata: { count: 0, providers: [] },
        });
      const o = e.map(e => ({
        id: e.id,
        name: e.config.name,
        description: e.config.description,
        provider: 'replicate',
        capabilities: {
          minWidth: e.config.minWidth,
          maxWidth: e.config.maxWidth,
          minHeight: e.config.minHeight,
          maxHeight: e.config.maxHeight,
          supportedAspectRatios: e.config.supportedAspectRatios,
          supportedFormats: e.config.supportedFormats,
        },
        pricing: { costPerImage: e.config.costPerImage },
        defaults: e.config.defaultOptions,
      }));
      r.json({
        success: !0,
        data: o,
        metadata: { count: o.length, providers: ['replicate'] },
      });
    } catch (e) {
      (logger_1.logger.error('List image models error:', e),
        r.status(500).json({
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to list image models',
        }));
    }
  }
}
exports.WorkflowController = WorkflowController;
