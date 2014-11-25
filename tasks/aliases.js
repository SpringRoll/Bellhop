module.exports = function(grunt)
{
	grunt.registerTask(
		'components', 
		'Install the components need for example',
		['bower-install-simple:dev']
	);

	grunt.registerTask(
		'test', 
		'Build test needed to run',
		['jshint']
	);
};
