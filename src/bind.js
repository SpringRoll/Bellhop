/**
*  @module global 
*/
(function(){
	
	"use strict";
	
	// If there's already a bind, ignore
	if (Function.prototype.bind) return;
	
	/**
	*  Designed to provide utility related to functions, the
	*  most important of which is the Bind function, used to properly scope callbacks.
	*  Add the bind functionality to the Function prototype
	*  this allows passing a reference in the function callback
	*  
	*	callback.bind(this)
	*	callback.bind(this, arg1)
	*  
	*  @class Function.prototype.bind
	*  @constructor
	*  @param {Object} that The reference to the function.
	*  @param {mixed} [args*] Additional arguments
	*  @return {Function} The new function binding.
	*/
	Function.prototype.bind = function(that) 
	{
		var target = this, 
			args,
			bound;

		if (typeof target != "function") 
		{
			throw new TypeError();
		}

		args = Array.prototype.slice.call(arguments, 1);
		bound = function()
		{
			if (this instanceof bound) 
			{
				var F, self, result;
				F = function(){};
				F.prototype = target.prototype;
				self = new F();

				result = target.apply(self, args.concat(Array.prototype.slice.call(arguments)));
				
				if (Object(result) === result)
				{
					return result;
				}
				return self;
			}
			else 
			{
				return target.apply(that, args.concat(Array.prototype.slice.call(arguments)));
			}
		};
		return bound;
	};
	
}());