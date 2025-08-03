import { l as n } from './previews-VxzUh5Ws.js';
class b {
  apiUrl;
  constructor(e = '') {
    this.apiUrl = e || '/api';
  }
  async executeWorkflow(e, t, o) {
    const r = e.map(a => {
        const s = {
          id: a.id,
          type: this.mapNodeTypeToBackend(a),
          label: a.data.label || '',
          parameters: {
            model: a.data.modelId,
            mediaModel: a.data.mediaId,
            ...(a.data.parameters || {}),
          },
        };
        return (
          a.data.label === 'Video Editing' &&
            n.info('[WorkflowService] Editing node parameters:', s.parameters),
          a.data.label === 'Caption Generation' &&
            n.info(
              '[WorkflowService] Caption Generation node parameters:',
              s.parameters
            ),
          s
        );
      }),
      i = t.map(a => ({
        id: a.id,
        source: a.source,
        target: a.target,
        sourceHandle: a.sourceHandle ?? void 0,
        targetHandle: a.targetHandle ?? void 0,
        data: a.data,
      })),
      d = {
        workflow: {
          id: `workflow_${Date.now()}`,
          name: 'User Workflow',
          nodes: r,
          edges: i,
        },
        initialInput: {
          prompt: String(o.prompt || ''),
          duration: o.duration,
          style: o.style,
        },
      };
    try {
      return await (
        await fetch(`${this.apiUrl}/workflow/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d),
        })
      ).json();
    } catch (a) {
      return {
        success: !1,
        error: a instanceof Error ? a.message : 'Failed to execute workflow',
      };
    }
  }
  async getExecutionStatus(e) {
    try {
      return await (
        await fetch(`${this.apiUrl}/workflow/execution/${e}`)
      ).json();
    } catch (t) {
      return {
        success: !1,
        error:
          t instanceof Error ? t.message : 'Failed to get execution status',
      };
    }
  }
  async listLLMModels() {
    try {
      const e = await fetch(`${this.apiUrl}/workflow/models/llm`);
      if (!e.ok) {
        n.error('Failed to fetch LLM models:', e.status, e.statusText);
        try {
          const o = await e.json();
          n.error('Error details:', o);
        } catch {
          n.error('Could not parse error response');
        }
        return [];
      }
      const t = await e.json();
      return t.success ? t.data : [];
    } catch (e) {
      return (n.error('Failed to fetch LLM models:', e), []);
    }
  }
  async listModels(e) {
    try {
      const t = await fetch(`${this.apiUrl}/workflow/models/${e}`);
      if (!t.ok)
        return (
          n.error(`Failed to fetch ${e} models:`, t.status, t.statusText),
          []
        );
      const o = await t.json();
      return o.success ? o.data : [];
    } catch (t) {
      return (n.error(`Failed to fetch ${e} models:`, t), []);
    }
  }
  async listVideoModels() {
    return this.listModels('video');
  }
  async listImageModels() {
    return this.listModels('image');
  }
  mapNodeTypeToBackend(e) {
    const t = {
        'User Prompt': 'userPrompt',
        'Script Generator': 'script',
        'Audio Generation': 'audioGeneration',
        'Image Prompt Generator': 'imagePrompt',
        'Image Prompts': 'imagePrompt',
        'Image Generation': 'imageGeneration',
        'Video Generation': 'videoGeneration',
        'Video Editor': 'editing',
        'Video Editing': 'editing',
        'Background Audio Generation': 'audioGeneration',
        'Caption Generator': 'captionGeneration',
        'Caption Generation': 'captionGeneration',
        'Final Output': 'finalOutput',
      },
      o = e.data?.label,
      r = t[o];
    return (
      r ||
      ({
        script: 'script',
        'image-prompt': 'imagePrompt',
        video: 'videoGeneration',
        generateImages: 'imageGeneration',
        custom: 'custom',
      }[e.type ?? 'custom'] ??
        e.type ??
        'custom')
    );
  }
  async cancelWorkflow(e) {
    try {
      const t = await fetch(`${this.apiUrl}/workflow/execution/${e}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return t.ok
        ? { success: !0 }
        : {
            success: !1,
            error: (await t.json()).message || 'Failed to cancel workflow',
          };
    } catch (t) {
      return (
        n.error('Failed to cancel workflow:', t),
        { success: !1, error: 'Failed to cancel workflow' }
      );
    }
  }
}
const f = new b();
class _ {
  constructor(e) {
    this.callbacks = e;
  }
  eventSource = null;
  isDebugLogged = !1;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  reconnectDelay = 2e3;
  executionId = null;
  nodesRef = null;
  isIntentionalDisconnect = !1;
  async playCompletionSound() {
    try {
      const e = new Audio('/assets/sounds/completed.mp3');
      ((e.volume = 0.7), await e.play());
    } catch (e) {
      n.warn('[SSE] Failed to play completion sound:', e);
    }
  }
  async playFailureSound() {
    try {
      const e = new Audio('/assets/sounds/fail.mp3');
      ((e.volume = 0.7), await e.play());
    } catch (e) {
      n.warn('[SSE] Failed to play failure sound:', e);
    }
  }
  connect(e, t) {
    (this.eventSource && this.disconnect(),
      (this.executionId = e),
      (this.nodesRef = t),
      (this.isIntentionalDisconnect = !1));
    const o = `/api/workflow/sse/progress/${e}`;
    return (
      (this.eventSource = new EventSource(o)),
      (this.eventSource.onmessage = r => {
        this.handleMessage(r, t);
      }),
      (this.eventSource.onerror = r => {
        (n.error('[SSE] Error:', r),
          !this.isIntentionalDisconnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
            ? (this.eventSource?.close(),
              (this.eventSource = null),
              this.reconnect())
            : (this.callbacks.onError('Connection lost'), this.disconnect()));
      }),
      (this.eventSource.onopen = () => {
        (this.reconnectAttempts > 0 &&
          (n.info('[SSE] Reconnected successfully'),
          this.callbacks.updateExecutionStatus(
            'Reconnected - resuming progress updates'
          )),
          (this.reconnectAttempts = 0));
      }),
      this.eventSource
    );
  }
  handleMessage(e, t) {
    try {
      const o = JSON.parse(e.data);
      switch ((o.type, o.type)) {
        case 'progress':
          this.handleProgress(o, t);
          break;
        case 'node-output':
          this.handleNodeOutput(o, t);
          break;
        case 'complete':
          this.handleComplete(o);
          break;
        default: {
          const r = o;
          n.warn('[SSE] Unknown message type:', r.type);
        }
      }
    } catch (o) {
      n.error('[SSE] Failed to parse message:', o);
    }
  }
  handleProgress(e, t) {
    const o = new Map();
    if (e.nodeStatuses.length > 0) {
      const i = e.nodeStatuses.find(d => d.nodeId === 'generate_script');
      (i && i.state, this.isDebugLogged || (this.isDebugLogged = !0));
    }
    (e.nodeStatuses.find(i => i.state === 'failed') && this.playFailureSound(),
      e.nodeStatuses.forEach(i => {
        o.set(i.nodeId, { state: i.state, progress: i.progress });
      }),
      this.callbacks.onProgress(o, e.progress),
      this.callbacks.updateExecutionStatus(
        `Workflow progress: ${Math.round(e.progress)}%`
      ));
  }
  handleNodeOutput(e, t) {
    const o = t.current.find(r => r.id === e.nodeId);
    if (o) {
      const r = `${e.nodeId}-output-${e.outputIndex}`;
      this.callbacks.addPreview(
        e.nodeId,
        e.outputType,
        e.outputData,
        o.position,
        r
      );
    }
    this.callbacks.onNodeOutput(
      e.nodeId,
      e.outputType,
      e.outputData,
      e.outputIndex
    );
  }
  handleComplete(e) {
    (this.disconnect(),
      e.result.status === 'completed'
        ? (this.playCompletionSound(),
          this.callbacks.stopExecution('Workflow completed successfully!'))
        : (this.playFailureSound(),
          this.callbacks.stopExecution(`Workflow failed: ${e.result.error}`)),
      setTimeout(() => this.callbacks.clearExecutionStatus(), 5e3),
      this.callbacks.onComplete(e.result.status, e.result.error));
  }
  reconnect() {
    if (this.isIntentionalDisconnect || !this.executionId || !this.nodesRef)
      return;
    this.reconnectAttempts++;
    const e = Math.min(this.reconnectDelay * this.reconnectAttempts, 1e4);
    (n.info(
      `[SSE] Attempting reconnection in ${e}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    ),
      setTimeout(() => {
        this.isIntentionalDisconnect ||
          (this.callbacks.updateExecutionStatus(
            `Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
          ),
          this.connect(this.executionId, this.nodesRef));
      }, e));
  }
  disconnect() {
    ((this.isIntentionalDisconnect = !0),
      this.eventSource &&
        (this.eventSource.close(),
        (this.eventSource = null),
        (this.isDebugLogged = !1)),
      (this.reconnectAttempts = 0),
      (this.executionId = null),
      (this.nodesRef = null));
  }
  isConnected() {
    return (
      this.eventSource !== null &&
      this.eventSource.readyState === EventSource.OPEN
    );
  }
  getReadyState() {
    return this.eventSource?.readyState ?? null;
  }
}
class S {
  constructor(e) {
    ((this.callbacks = e),
      (this.sseManager = new _({
        onProgress: (t, o) => {
          this.callbacks.updateNodeStates(t);
        },
        onNodeOutput: () => {},
        onComplete: () => {},
        onError: t => {
          this.callbacks.stopExecution(t);
        },
        updateExecutionStatus: this.callbacks.updateExecutionStatus,
        stopExecution: this.callbacks.stopExecution,
        clearExecutionStatus: this.callbacks.clearExecutionStatus,
        addPreview: this.callbacks.addPreview,
      })));
  }
  sseManager;
  async execute(e, t, o, r) {
    (n.debug('🚀 [WORKFLOW] Execute workflow called'),
      n.warn(
        '[WORKFLOW] Starting workflow execution - this should show in console'
      ),
      n.debug('Current nodes from ref:', o.current),
      n.debug(
        'Node labels:',
        o.current.map(s => s.data.label)
      ));
    const i = o.current.find(s => s.data.label === 'User Prompt');
    if (!i) {
      alert('Please add a User Prompt node to start the workflow');
      return;
    }
    const d = i.data.userPromptData;
    if (!d?.idea) {
      alert('Please click "Add Idea" to provide your video concept');
      return;
    }
    const a = d;
    (this.callbacks.clearAllPreviews(), this.callbacks.resetNodeStates());
    try {
      const s = await f.executeWorkflow(o.current, t, {
        prompt: a.idea,
        duration: a.duration,
        style: a.style || 'professional',
      });
      if (s.success && s.data?.executionId) {
        this.callbacks.startExecution(
          s.data.executionId,
          'Workflow started...'
        );
        const c = this.sseManager.connect(s.data.executionId, o);
        r.current = c;
      } else this.callbacks.stopExecution(`Workflow failed: ${s.error}`);
    } catch (s) {
      this.callbacks.stopExecution(
        `Error: ${s instanceof Error ? s.message : 'Unknown error'}`
      );
    }
  }
  cleanup() {
    this.sseManager.disconnect();
  }
}
const T = Object.freeze(
    Object.defineProperty(
      { __proto__: null, WorkflowExecutionHandler: S },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  m = {
    name: 'Complete Video Generation',
    description: 'Full workflow from idea to final video with captions',
    nodes: [
      {
        id: 'user_prompt_node',
        type: 'custom',
        position: { x: 50, y: 300 },
        data: {
          label: 'User Prompt',
          description: 'Input video idea, duration & dimensions',
          icon: '💭',
          hasModel: !1,
          nodeType: 'userPrompt',
          userPromptData: {
            idea: "What they don't want you to know about everyday objects watching you",
            duration: 30,
            aspectRatio: '9:16',
            style: 'dark-truth',
            visualStyle: 'analog-horror',
          },
          parameters: {
            idea: "What they don't want you to know about everyday objects watching you",
            duration: 30,
            aspectRatio: '9:16',
            style: 'dark-truth',
            visualStyle: 'analog-horror',
            language: 'english',
          },
        },
      },
      {
        id: 'script_node',
        type: 'custom',
        position: { x: 400, y: 300 },
        data: {
          label: 'Script Generator',
          description: 'Generate script in sections',
          icon: '📝',
          hasModel: !0,
          nodeType: 'script',
          parameters: {
            style: 'professional',
            model: 'anthropic/claude-sonnet-4',
          },
        },
      },
      {
        id: 'audio_gen_node',
        type: 'custom',
        position: { x: 750, y: 200 },
        data: {
          label: 'Audio Generation',
          description: 'Generate narration for each section',
          icon: '🔊',
          hasMedia: !0,
          mediaType: 'audio',
          mediaId: '',
          parameters: { voice: 'Friendly_Person', pitch: 0, speed: 1.15 },
        },
      },
      {
        id: 'image_prompt_node',
        type: 'custom',
        position: { x: 750, y: 400 },
        data: {
          label: 'Image Prompt Generator',
          description: 'Create prompts for each scene',
          icon: '🎨',
          hasModel: !0,
          nodeType: 'prompts',
          parameters: { model: 'anthropic/claude-sonnet-4' },
        },
      },
      {
        id: 'image_gen_node',
        type: 'custom',
        position: { x: 1100, y: 400 },
        data: {
          label: 'Image Generation',
          description: 'Generate images from prompts',
          icon: '🖼️',
          hasMedia: !0,
          mediaType: 'image',
          mediaId: 'seedream-3',
          nodeType: 'image',
          parameters: { outputFormat: 'webp', aspectRatio: '9:16' },
        },
      },
      {
        id: 'video_gen_node',
        type: 'custom',
        position: { x: 1450, y: 400 },
        data: {
          label: 'Video Generation',
          description: 'Generate videos from images',
          icon: '🎬',
          hasMedia: !0,
          mediaType: 'video',
          mediaId: 'bytedance/seedance-1-lite',
          nodeType: 'video',
          parameters: {
            mode: 'standard',
            resolution: '720p',
            aspectRatio: '9:16',
          },
        },
      },
      {
        id: 'editing_node',
        type: 'custom',
        position: { x: 1800, y: 300 },
        data: {
          label: 'Video Editing',
          description: 'Combine all elements',
          icon: '✂️',
          hasModel: !1,
          parameters: {
            audioFadeIn: 0.5,
            audioFadeOut: 1,
            enableWhipZoom: !0,
            zoomDuration: 0.3,
            zoomType: 'out',
            enableIntroSound: !0,
            enableTransitionSounds: !0,
            introSoundPath: 'assets/sounds/intro-whoosh.mp3',
            transitionSoundPath: 'assets/sounds/whoosh.mp3',
            soundEffectVolume: 0.8,
            transitionSoundVolume: 0.6,
          },
        },
      },
      {
        id: 'caption_gen_node',
        type: 'custom',
        position: { x: 2150, y: 300 },
        data: {
          label: 'Caption Generation',
          description: 'Generate captions/subtitles',
          icon: '💬',
          hasMedia: !0,
          mediaType: 'caption',
          mediaId: '',
          parameters: {
            language: 'en',
            position: 'middle',
            embedInVideo: !0,
            fontFamily: 'Archivo Black',
            fontSize: 54,
            outputFormat: 'ass',
            lineHeight: 0.8,
            maxLineLength: 25,
            captionLeadTime: 0,
            timingOffset: 0,
          },
        },
      },
      {
        id: 'final_output_node',
        type: 'custom',
        position: { x: 2500, y: 300 },
        data: {
          label: 'Final Output',
          description: 'Export final video',
          icon: '✅',
          hasModel: !1,
          parameters: {
            outputFormat: 'mp4',
            quality: 'high',
            optimization: 'balanced',
          },
        },
      },
    ],
    edges: [
      {
        id: 'edge_1',
        source: 'user_prompt_node',
        target: 'script_node',
        type: 'smoothstep',
        animated: !0,
        label: 'prompt',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#3b82f6', strokeWidth: 3 },
        data: { sourcePort: 'prompt', targetPort: 'prompt' },
      },
      {
        id: 'edge_1b',
        source: 'user_prompt_node',
        target: 'script_node',
        type: 'smoothstep',
        animated: !1,
        label: 'duration',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'duration', targetPort: 'duration' },
      },
      {
        id: 'edge_1c',
        source: 'user_prompt_node',
        target: 'script_node',
        type: 'smoothstep',
        animated: !1,
        label: 'style',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'style', targetPort: 'style' },
      },
      {
        id: 'edge_1d',
        source: 'user_prompt_node',
        target: 'script_node',
        type: 'smoothstep',
        animated: !1,
        label: 'language',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'language', targetPort: 'language' },
      },
      {
        id: 'edge_2',
        source: 'script_node',
        target: 'audio_gen_node',
        type: 'smoothstep',
        animated: !0,
        label: 'script',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#f97316', strokeWidth: 2 },
        data: { sourcePort: 'script', targetPort: 'script' },
      },
      {
        id: 'edge_2b',
        source: 'user_prompt_node',
        target: 'audio_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'language',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'language', targetPort: 'language' },
      },
      {
        id: 'edge_3',
        source: 'script_node',
        target: 'image_prompt_node',
        type: 'smoothstep',
        animated: !0,
        label: 'script',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        data: { sourcePort: 'script', targetPort: 'script' },
      },
      {
        id: 'edge_3b',
        source: 'user_prompt_node',
        target: 'image_prompt_node',
        type: 'smoothstep',
        animated: !1,
        label: 'visualStyle',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'visualStyle', targetPort: 'visualStyle' },
      },
      {
        id: 'edge_4',
        source: 'image_prompt_node',
        target: 'image_gen_node',
        type: 'smoothstep',
        animated: !0,
        label: 'prompts',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        data: { sourcePort: 'imagePrompts', targetPort: 'imagePrompts' },
      },
      {
        id: 'edge_4b',
        source: 'user_prompt_node',
        target: 'image_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'aspectRatio',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'aspectRatio', targetPort: 'aspectRatio' },
      },
      {
        id: 'edge_5',
        source: 'image_gen_node',
        target: 'video_gen_node',
        type: 'smoothstep',
        animated: !0,
        label: 'images',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        data: { sourcePort: 'images', targetPort: 'images' },
      },
      {
        id: 'edge_5b',
        source: 'user_prompt_node',
        target: 'video_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'aspectRatio',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'aspectRatio', targetPort: 'aspectRatio' },
      },
      {
        id: 'edge_7a',
        source: 'video_gen_node',
        target: 'editing_node',
        type: 'smoothstep',
        animated: !0,
        label: 'videos',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        data: { sourcePort: 'videos', targetPort: 'videos' },
      },
      {
        id: 'edge_7b',
        source: 'audio_gen_node',
        target: 'editing_node',
        type: 'smoothstep',
        animated: !0,
        label: 'audio',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#f97316', strokeWidth: 2 },
        data: { sourcePort: 'audioFiles', targetPort: 'audioFiles' },
      },
      {
        id: 'edge_7c',
        source: 'audio_gen_node',
        target: 'editing_node',
        type: 'smoothstep',
        animated: !1,
        label: 'transcripts',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'transcripts', targetPort: 'transcripts' },
      },
      {
        id: 'edge_8',
        source: 'editing_node',
        target: 'caption_gen_node',
        type: 'smoothstep',
        animated: !0,
        label: 'edited video',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#10b981', strokeWidth: 3 },
        data: { sourcePort: 'editedVideo', targetPort: 'editedVideo' },
      },
      {
        id: 'edge_8b',
        source: 'editing_node',
        target: 'caption_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'adjusted transcripts',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: {
          sourcePort: 'adjustedTranscripts',
          targetPort: 'adjustedTranscripts',
        },
      },
      {
        id: 'edge_8c',
        source: 'user_prompt_node',
        target: 'caption_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'language',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: {
          stroke: '#64748b',
          strokeWidth: 1.5,
          strokeDasharray: '5,5',
          opacity: 0.6,
        },
        data: { sourcePort: 'language', targetPort: 'language' },
      },
      {
        id: 'edge_9',
        source: 'caption_gen_node',
        target: 'final_output_node',
        type: 'smoothstep',
        animated: !0,
        label: 'final video',
        labelStyle: { fill: '#94a3b8', fontSize: 11 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#10b981', strokeWidth: 3 },
        data: {
          sourcePort: 'videoWithCaptions',
          targetPort: 'videoWithCaptions',
        },
      },
      {
        id: 'edge_8d',
        source: 'audio_gen_node',
        target: 'caption_gen_node',
        type: 'smoothstep',
        animated: !1,
        label: 'audio for STT',
        labelStyle: { fill: '#64748b', fontSize: 10 },
        labelBgStyle: { fill: 'rgba(0,0,0,0.8)' },
        style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '8,4' },
        data: { sourcePort: 'audioFiles', targetPort: 'audioFiles' },
      },
    ],
  },
  x = Object.freeze(
    Object.defineProperty(
      { __proto__: null, videoGenerationTemplate: m },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  u = {
    dashed: {
      stroke: '#64748b',
      strokeWidth: 1.5,
      strokeDasharray: '5,5',
      opacity: 0.6,
    },
  };
function l(p) {
  const {
      id: e,
      source: t,
      target: o,
      label: r,
      sourcePort: i,
      targetPort: d,
      animated: a = !1,
      style: s = u.dashed,
    } = p,
    c = { id: e, source: t, target: o, type: 'smoothstep', animated: a };
  return (
    r &&
      ((c.label = r),
      (c.labelStyle = { fill: '#64748b', fontSize: 10 }),
      (c.labelBgStyle = { fill: 'rgba(0,0,0,0.8)' })),
    s && (c.style = s),
    (i || d) &&
      (c.data = { ...(i && { sourcePort: i }), ...(d && { targetPort: d }) }),
    c
  );
}
const k = {
  name: 'Test Video Generation (No API)',
  description: 'Test workflow using predefined files - NO API COSTS',
  nodes: [
    {
      id: 'user_prompt_node',
      type: 'custom',
      position: { x: 50, y: 300 },
      data: {
        label: 'Test Prompt',
        description: 'Fixed test prompt for consistent testing',
        icon: '🧪',
        hasModel: !1,
        nodeType: 'userPrompt',
        userPromptData: {
          idea: 'Test video generation without API calls',
          duration: 30,
          aspectRatio: '9:16',
          style: 'test-mode',
          visualStyle: 'test',
        },
        parameters: {
          idea: 'Test video generation without API calls',
          duration: 30,
          aspectRatio: '9:16',
          style: 'test-mode',
          visualStyle: 'test',
          language: 'english',
        },
      },
    },
    {
      id: 'script_node',
      type: 'custom',
      position: { x: 400, y: 300 },
      data: {
        label: 'Script (Mock)',
        description: 'Returns predefined script',
        icon: '📝',
        hasModel: !0,
        nodeType: 'script',
        parameters: { style: 'test', model: 'test-mode' },
      },
    },
    {
      id: 'audio_gen_node',
      type: 'custom',
      position: { x: 750, y: 200 },
      data: {
        label: 'Audio (Test Files)',
        description: 'Uses predefined audio files',
        icon: '🔊',
        hasMedia: !0,
        mediaType: 'audio',
        mediaId: 'test-mode',
        parameters: { voice: 'test', pitch: 0, speed: 1 },
      },
    },
    {
      id: 'image_prompt_node',
      type: 'custom',
      position: { x: 750, y: 400 },
      data: {
        label: 'Image Prompts (Mock)',
        description: 'Returns test prompts',
        icon: '🎨',
        hasModel: !0,
        nodeType: 'prompts',
        parameters: { model: 'test-mode' },
      },
    },
    {
      id: 'image_gen_node',
      type: 'custom',
      position: { x: 1100, y: 400 },
      data: {
        label: 'Images (Mock)',
        description: 'Returns test images',
        icon: '🖼️',
        hasMedia: !0,
        mediaType: 'image',
        mediaId: 'test-mode',
        nodeType: 'image',
        parameters: { outputFormat: 'jpg', aspectRatio: '9:16' },
      },
    },
    {
      id: 'video_gen_node',
      type: 'custom',
      position: { x: 1450, y: 400 },
      data: {
        label: 'Video (Test Files)',
        description: 'Uses predefined video files',
        icon: '🎬',
        hasMedia: !0,
        mediaType: 'video',
        mediaId: 'test-mode',
        nodeType: 'video',
        parameters: { mode: 'test', resolution: '720p', aspectRatio: '9:16' },
      },
    },
    {
      id: 'editing_node',
      type: 'custom',
      position: { x: 1800, y: 300 },
      data: {
        label: 'Video Editing',
        description: 'Real editing with test files',
        icon: '✂️',
        hasModel: !1,
        parameters: {
          audioFadeIn: 0.5,
          audioFadeOut: 1,
          enableWhipZoom: !0,
          zoomDuration: 0.3,
          zoomType: 'out',
          enableIntroSound: !0,
          enableTransitionSounds: !0,
          introSoundPath: 'assets/sounds/intro-whoosh.mp3',
          transitionSoundPath: 'assets/sounds/whoosh.mp3',
          soundEffectVolume: 0.8,
          transitionSoundVolume: 0.6,
          transitionType: 'diagonal',
          transitionDuration: 0.15,
        },
      },
    },
    {
      id: 'caption_gen_node',
      type: 'custom',
      position: { x: 2150, y: 300 },
      data: {
        label: 'Captions (Whisper + Timing)',
        description: 'Test Whisper STT + 0.05s lead time',
        icon: '💬',
        hasMedia: !0,
        mediaType: 'caption',
        mediaId: 'test-mode',
        parameters: {
          language: 'en',
          position: 'middle',
          embedInVideo: !0,
          fontFamily: 'Archivo Black',
          fontSize: 54,
          outputFormat: 'ass',
          lineHeight: 0.8,
          maxLineLength: 25,
          captionLeadTime: 0.05,
        },
      },
    },
    {
      id: 'final_output_node',
      type: 'custom',
      position: { x: 2500, y: 300 },
      data: {
        label: 'Final Output',
        description: 'Export test video',
        icon: '✅',
        hasModel: !1,
        parameters: {
          outputFormat: 'mp4',
          quality: 'high',
          optimization: 'balanced',
        },
      },
    },
  ],
  edges: [
    l({
      id: 'edge_1',
      source: 'user_prompt_node',
      target: 'script_node',
      label: 'prompt',
      sourcePort: 'prompt',
      targetPort: 'prompt',
      animated: !0,
      style: { stroke: '#3b82f6', strokeWidth: 3 },
    }),
    l({
      id: 'edge_1_duration',
      source: 'user_prompt_node',
      target: 'script_node',
      label: 'duration',
      sourcePort: 'duration',
      targetPort: 'duration',
      style: u.dashed,
    }),
    l({
      id: 'edge_1_style',
      source: 'user_prompt_node',
      target: 'script_node',
      label: 'style',
      sourcePort: 'style',
      targetPort: 'style',
      style: u.dashed,
    }),
    l({
      id: 'edge_1_language',
      source: 'user_prompt_node',
      target: 'script_node',
      label: 'language',
      sourcePort: 'language',
      targetPort: 'language',
      style: u.dashed,
    }),
    l({
      id: 'edge_2',
      source: 'script_node',
      target: 'audio_gen_node',
      label: 'script',
      sourcePort: 'script',
      targetPort: 'script',
      animated: !0,
      style: { stroke: '#f97316', strokeWidth: 2 },
    }),
    l({
      id: 'edge_2b',
      source: 'user_prompt_node',
      target: 'audio_gen_node',
      label: 'language',
      sourcePort: 'language',
      targetPort: 'language',
      style: u.dashed,
    }),
    l({
      id: 'edge_3',
      source: 'script_node',
      target: 'image_prompt_node',
      label: 'script',
      sourcePort: 'script',
      targetPort: 'script',
      animated: !0,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }),
    l({
      id: 'edge_3b',
      source: 'user_prompt_node',
      target: 'image_prompt_node',
      label: 'visualStyle',
      sourcePort: 'visualStyle',
      targetPort: 'visualStyle',
      style: u.dashed,
    }),
    l({
      id: 'edge_4',
      source: 'image_prompt_node',
      target: 'image_gen_node',
      label: 'prompts',
      sourcePort: 'imagePrompts',
      targetPort: 'imagePrompts',
      animated: !0,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }),
    l({
      id: 'edge_4b',
      source: 'user_prompt_node',
      target: 'image_gen_node',
      label: 'aspectRatio',
      sourcePort: 'aspectRatio',
      targetPort: 'aspectRatio',
      style: u.dashed,
    }),
    l({
      id: 'edge_5',
      source: 'image_gen_node',
      target: 'video_gen_node',
      label: 'images',
      sourcePort: 'images',
      targetPort: 'images',
      animated: !0,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }),
    l({
      id: 'edge_5_aspectRatio',
      source: 'user_prompt_node',
      target: 'video_gen_node',
      label: 'aspectRatio',
      sourcePort: 'aspectRatio',
      targetPort: 'aspectRatio',
      style: u.dashed,
    }),
    l({
      id: 'edge_5_visualStyle',
      source: 'user_prompt_node',
      target: 'video_gen_node',
      label: 'visualStyle',
      sourcePort: 'visualStyle',
      targetPort: 'visualStyle',
      style: u.dashed,
    }),
    l({
      id: 'edge_7a',
      source: 'video_gen_node',
      target: 'editing_node',
      label: 'videos',
      sourcePort: 'videos',
      targetPort: 'videos',
      animated: !0,
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
    }),
    l({
      id: 'edge_7b',
      source: 'audio_gen_node',
      target: 'editing_node',
      label: 'audio',
      sourcePort: 'audioFiles',
      targetPort: 'audioFiles',
      animated: !0,
      style: { stroke: '#f97316', strokeWidth: 2 },
    }),
    l({
      id: 'edge_7c',
      source: 'audio_gen_node',
      target: 'editing_node',
      label: 'transcripts',
      sourcePort: 'transcripts',
      targetPort: 'transcripts',
      style: u.dashed,
    }),
    l({
      id: 'edge_8',
      source: 'editing_node',
      target: 'caption_gen_node',
      label: 'edited video',
      sourcePort: 'editedVideo',
      targetPort: 'editedVideo',
      animated: !0,
      style: { stroke: '#10b981', strokeWidth: 3 },
    }),
    l({
      id: 'edge_8b',
      source: 'editing_node',
      target: 'caption_gen_node',
      label: 'adjusted transcripts',
      sourcePort: 'adjustedTranscripts',
      targetPort: 'adjustedTranscripts',
      style: u.dashed,
    }),
    l({
      id: 'edge_8c',
      source: 'user_prompt_node',
      target: 'caption_gen_node',
      label: 'language',
      sourcePort: 'language',
      targetPort: 'language',
      style: u.dashed,
    }),
    l({
      id: 'edge_8d',
      source: 'audio_gen_node',
      target: 'caption_gen_node',
      label: 'audio for STT',
      sourcePort: 'audioFiles',
      targetPort: 'audioFile',
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '8,4' },
    }),
    l({
      id: 'edge_9',
      source: 'caption_gen_node',
      target: 'final_output_node',
      label: 'final video',
      sourcePort: 'videoWithCaptions',
      targetPort: 'videoWithCaptions',
      animated: !0,
      style: { stroke: '#10b981', strokeWidth: 3 },
    }),
  ],
};
class P {
  constructor(e) {
    this.callbacks = e;
  }
  loadTestTemplate(e, t, o) {
    this.loadTemplate(k, e, t, o);
  }
  loadVideoTemplate(e, t, o) {
    this.loadTemplate(m, e, t, o);
  }
  loadTemplate(e, t, o, r) {
    if (
      t.length > 0 &&
      !window.confirm('This will replace the current workflow. Continue?')
    )
      return;
    (this.callbacks.clearWorkflow(),
      this.callbacks.updateNodeStates(new Map()),
      this.callbacks.stopExecution());
    const i = e.nodes.map(a => {
      const s = {
        onDelete: () => this.callbacks.deleteNode(a.id),
        onDataChange: c => {
          (this.callbacks.updateNodeData(a.id, c),
            a.data.label === 'User Prompt' &&
              setTimeout(() => {
                const g = o.current,
                  h = r.current,
                  y = this.callbacks.updateNodeParametersFromEdges(g, h);
                this.callbacks.setNodes(y);
              }, 50));
        },
      };
      if (
        (a.data.label === 'User Prompt' &&
          (n.debug('Adding execute handler to User Prompt node'),
          (s.onExecute = this.callbacks.handleExecuteWorkflow)),
        a.data.hasModel &&
          (s.onModelChange = c => this.callbacks.handleModelChange(a.id, c)),
        a.data.hasMedia &&
          ((s.onMediaChange = c => this.callbacks.handleMediaChange(a.id, c)),
          a.data.mediaType === 'audio'))
      ) {
        s.onVoiceChange = g => this.callbacks.handleVoiceChange(a.id, g);
        const c = a.data;
        s.voice = c.parameters?.voice || 'Orion';
      }
      return { ...a, data: { ...a.data, ...s } };
    });
    (n.debug('Setting nodes with handlers:', i),
      n.debug(
        'User Prompt node:',
        i.find(a => a.data.label === 'User Prompt')
      ),
      n.debug('[loadVideoTemplate] Setting nodes:', i));
    const d = this.callbacks.updateNodeParametersFromEdges(i, e.edges);
    (this.callbacks.setNodes(d),
      n.debug('[loadTemplate] Setting edges from template:', e.edges),
      n.debug('[loadTemplate] Edge count:', e.edges.length),
      this.callbacks.setEdges(e.edges),
      setTimeout(() => {
        this.callbacks.optimizeVideoLayout(d, e.edges);
      }, 50));
  }
}
const E = Object.freeze(
  Object.defineProperty(
    { __proto__: null, TemplateLoader: P },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
class w {
  constructor(e) {
    this.callbacks = e;
  }
  handleModelChange(e, t) {
    this.callbacks.updateNodeData(e, {
      modelId: t,
      onModelChange: o => this.handleModelChange(e, o),
    });
  }
  handleMediaChange(e, t, o) {
    const r = o?.find(s => s.id === e),
      i = r?.data?.parameters || {},
      d = r?.data?.mediaType === 'video' || r?.data?.mediaType === 'image',
      a = { mediaId: t, onMediaChange: s => this.handleMediaChange(e, s, o) };
    (d && (a.parameters = { ...i, model: t }),
      this.callbacks.updateNodeData(e, a));
  }
  handleVoiceChange(e, t, o) {
    const i = o.find(d => d.id === e)?.data?.parameters || {};
    this.callbacks.updateNodeData(e, {
      voice: t,
      parameters: { ...i, voice: t },
      onVoiceChange: d => this.handleVoiceChange(e, d, o),
    });
  }
}
const W = Object.freeze(
  Object.defineProperty(
    { __proto__: null, NodeEventHandlers: w },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
export { W as N, E as T, T as W, x as v, f as w };
