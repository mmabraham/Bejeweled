import Jewel from './jewel';

export default class NullJewel extends Jewel {
  constructor(pos) {
    super(pos, null, 'NULL')
  }

  matches() {
    return false;
  }
}
