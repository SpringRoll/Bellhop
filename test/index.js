var bellhop = new Bellhop();
bellhop.connect($("#child").get(0));

QUnit.test('Tests', function(assert)
{
	var done = assert.async();

	assert.expect(4);
	assert.ok(bellhop.supported, "Bellhop is connected");
	assert.ok(bellhop instanceof BellhopEventDispatcher, "Bellhop extends");

	// console.log("listen to highscore event");
	bellhop.fetch('highscore', function(e)
	{
		// console.log("highscore event received", e);
		assert.strictEqual(e.type, 'highscore', 'Event type received');
		assert.strictEqual(e.data, 10000, 'Event data received');
		done();
	});
});
