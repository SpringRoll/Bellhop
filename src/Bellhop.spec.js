import { Bellhop } from './Bellhop';
import { BellhopEventDispatcher } from './BellhopEventDispatcher';

let bellhop;

const open = () => karmaHTML.child.open();
const iframe = () => karmaHTML.child.iframe;

beforeEach(() => {
  karmaHTML.child.close();
  bellhop = new Bellhop();
});

describe('Bellhop Client', () => {
  it('Should construct', () => {
    expect(bellhop).to.be.instanceof(BellhopEventDispatcher);
  });

  it('Should be able to communicate to the child with connect()', done => {
    bellhop.on('connected', () => {
      done();
    });

    bellhop.connect(iframe());
    open();
    expect(bellhop.iframe).to.equal(iframe());
  });

  it('should denote supported if it can connect properly', () => {
    bellhop.connect(iframe());

    expect(bellhop.supported).to.equal(true);
  });

  it('Trigger should call event', done => {
    bellhop.on('highscore', () => {
      done();
    });
    bellhop.trigger('highscore');
  });

  it('Should be able to remove events', () => {
    const funcToRemove = () => 0;
    expect(bellhop._listeners.toRemove).to.be.undefined;
    bellhop.on('toRemove', funcToRemove);
    expect(bellhop._listeners.toRemove).to.not.be.undefined;
    bellhop.off('toRemove', funcToRemove);
    expect(bellhop._listeners.toRemove.length).to.equal(0);
  });

  it('Fetch should return a response from the child', done => {
    bellhop.connect(iframe());
    open();
    bellhop.fetch('highscore', e => {
      expect(e.type).to.equal('highscore');
      expect(e.data).to.equal(10000);
      done();
    });
  });

  it('Should completely disconnect with destroy()', () => {
    bellhop.destroy();
    expect(bellhop.connected).to.be.false;
    expect(bellhop.connecting).to.be.false;
    expect(bellhop.origin).to.be.null;
    expect(bellhop.iframe).to.be.null;
    expect(bellhop._sendLater.length).to.equal(0);
    expect(Object.keys(bellhop._listeners).length).to.equal(0);
  });

  it('It should send later if "connecting" status is true', done => {
    bellhop.connect(iframe());
    bellhop.on('sendLater', e => {
      expect(e.data).to.equal(1);
      done();
    });
    open();
    bellhop.send('sendLater', 1);
    expect(bellhop.connecting).to.be.true;
  });
});
