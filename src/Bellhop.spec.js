import Bellhop from './Bellhop';
import BellhopEventDispatcher from './BellhopEventDispatcher';

let bellhop;

before(() => {
  const h1 = document.createElement('h1');
  h1.innerText = 'Parent';
  document.body.appendChild(h1);
  bellhop = new Bellhop('MAIN');
});

describe('Bellhop Client', () => {
  it('Should construct', () => {
    expect(bellhop).to.be.instanceof(BellhopEventDispatcher);
  });

  it('Should be able to communicate to the child with connect()', done => {
    bellhop.on('connected', () => {
      done();
    });

    bellhop.connect(karmaHTML.child.iframe);
    karmaHTML.child.open();
    // window.postMessage('connected', '*');
    expect(bellhop.iframe).to.equal(karmaHTML.child.iframe);
  });

  it('Trigger should call event', done => {
    bellhop.on('highscore', () => {
      done();
    });
    bellhop.trigger('highscore');
  });

  it('Fetch should return a response from the child', done => {
    bellhop.fetch('highscore', e => {
      expect(e.type).to.equal('highscore');
      expect(e.data).to.equal(10000);
      done();
    });
  });
});
