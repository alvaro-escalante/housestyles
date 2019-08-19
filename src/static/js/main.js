import { select, selectAll, getId, each, listen } from './components/functions' 
window.onload = (() => {
  const app = {
  	init() {
      app.setSharing()
  	},
    // Detect element is on viewport
    viewPort: el => {
      const rect = el.getBoundingClientRect(), offset = rect.height,
            viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
            
      return viewHeight > rect.top + viewHeight - offset
    },
    // Function to smooth scroll to a given element 
    animate: (to, time) => {
      time = typeof time === 'undefined' ? 1000 : time
      let doc = document.scrollingElement || document.documentElement
      if (!doc) return
      const start = new Date().getTime(), timer = setInterval(() => {
        let step = Math.min(1, (new Date().getTime() - start) / time)
        doc.scrollTop = (window.pageYOffset + step * (to - window.pageYOffset))
        if (step === 1)  clearInterval(timer)
      }, 25)
      doc.scrollTop = window.pageYOffset
    },
    setSharing: () => {
      const getMetaContentByName = (name, attrtype, content) => {
        content = content == null ? 'content' : content
        const ret = select('meta[' + attrtype + '=\'' + name + '\']').getAttribute(content)
        return ret.replace(/ /gi, '%20');
      }
      
      each(selectAll('.social'), els => {
        let txt = els.href.replace(/SBTITLE/gi, getMetaContentByName('og:title', 'property'))
        txt = txt.replace(/SBLINK/gi, escape(window.location.href))
        els.href = txt
      })
    }
  }
  // Run form and send data and testMode boolean
  return app.init()
})()