import Bellhop from './Bellhop';
import BellhopEventDispatcher from './BellhopEventDispatcher';
const bellhop = new Bellhop();

let iFrame;
before(() => {
  iFrame = document.createElement('iframe');

  document.body.appendChild(iFrame);
});

describe('Bellhop Client', () => {
  it('Should construct', () => {
    expect(bellhop.supported).to.be.null;

    expect(bellhop).to.be.instanceof(BellhopEventDispatcher);
  });

  it('Should be able to set the iframe on connect', () => {
    bellhop.connect(iFrame);

    expect(bellhop.iframe).to.equal(iFrame);
  });
});
