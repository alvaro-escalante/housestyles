// Helper functions to manipulate DOM, format numbers and debounce
export const
	// Select single element
	select     = el  => document.querySelector(el),
	// Select Nodelist array of elements
	selectAll  = els => document.querySelectorAll(els),
	// Select elements by id
	getId      = id  => document.getElementById(id),
	// Capitalise string
	caps  		 = str => str.charAt(0).toUpperCase() + str.slice(1),
	each 			 = (array, callback) => {
  	for (let i = 0, j = array.length; i < j; i++) callback.call(i, array[i])
  },
  rect 			 = el => el.getBoundingClientRect(),
  offSet = el => {
  	const rect = el.getBoundingClientRect()
	  return {
	    top: rect.top + window.pageYOffset,
	    left: rect.left + window.pageXOffset,
	  }
	},
  // Multi addEventListener, takes multiple parameters ('click load change etc')
  listen 		 = (el, s, fn) => each(s.split(' '), e => el.addEventListener(e, fn, false))