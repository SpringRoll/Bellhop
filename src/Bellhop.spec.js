import Bellhop from './Bellhop';
import BellhopEventDispatcher from './BellhopEventDispatcher';

let bellhop;

before(done => {
  bellhop = new Bellhop('MAIN');
  karmaHTML.child.onstatechange = ready => {
    if (ready) {
      done();
    }
  };
  karmaHTML.child.open();
});

describe('Bellhop Client', () => {
  it('Should construct', () => {
    expect(bellhop).to.be.instanceof(BellhopEventDispatcher);
  });

  it('Should be able to set the iframe with connect', done => {
    bellhop.on('connected', e => {
      expect(e.type).to.equal('connected');
      done();
    });
    bellhop.connect(karmaHTML.child.iframe);
    expect(bellhop.iframe).to.equal(karmaHTML.child.iframe);
  });

  // it('Trigger should call event', done => {
  //   bellhop.on('highscore', () => {
  //     done();
  //   });
  //   bellhop.trigger('highscore');
  // });

  // it('Fetch should return a response', done => {
  //   bellhop.on('connected', () => {
  //     console.log('connected');
  //     bellhop.fetch('highscore', e => {
  //       console.log('event data', e);
  //       done();
  //     });
  //   });
  //   bellhop.connect(karmaHTML.child.iframe);
  // });
});
