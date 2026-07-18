import test from 'node:test';
import assert from 'node:assert/strict';
import {motionProfile, getMotionDuration} from '../smt-motion.js';

test('normal, quick and reduced motion profiles remain explicit', () => {
  assert.equal(getMotionDuration('drawer', motionProfile.normal), 240);
  assert.ok(getMotionDuration('drawer', motionProfile.quick) < 240);
  assert.equal(getMotionDuration('drawer', motionProfile.reduced), 0);
});
