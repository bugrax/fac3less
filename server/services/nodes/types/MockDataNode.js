'use strict';
(Object.defineProperty(exports, '__esModule', { value: !0 }),
(exports.MockDataNode = void 0));
const BaseNode_1 = require('./BaseNode'),
  DataTypes_1 = require('../../../shared/types/DataTypes'),
  logger_1 = require('../../../utils/logger');
class MockDataNode extends BaseNode_1.BaseNode {
  constructor(config) {
    super({ ...config, type: 'mockData' });
  }
  defineDefaultPorts() {
    return {
      inputs: [],
      outputs: [
        {
          name: 'data',
          type: DataTypes_1.DataType.ANY,
          description: 'Mock data output'
        }
      ]
    };
  }
  async execute(e, t) {
    try {
      return {
        success: !0,
        data: this.config.parameters?.outputData || {},
        metadata: { nodeId: this.config.id, mockData: !0 }
      };
    } catch (e) {
      return (
        logger_1.logger.error('MockDataNode execution failed', {
          error: e instanceof Error ? e.message : 'Unknown error',
          stack: e instanceof Error ? e.stack : void 0,
          nodeId: this.config.id,
          parameters: this.config.parameters
        }),
        {
          success: !1,
          error: e instanceof Error ? e.message : 'Failed to output mock data'
        }
      );
    }
  }
  validateCustom(e) {
    return null;
  }
}
exports.MockDataNode = MockDataNode;
