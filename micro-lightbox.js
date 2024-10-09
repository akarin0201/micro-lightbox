(() => {    
    class Lightbox {
        settings = {
            lightboxClass: 'aka-lightbox'
        };
        HTMLElems = {};
        gallery = [];
        currentIndex = 0;
        svgUrl = 'http://www.w3.org/2000/svg';
        svgFig = {prev:{namespace:this.svgUrl,element:'svg',attributes:{width:'48',height:'48',viewBox:'0 0 100 100',style:'position:absolute;top:50%;left:2%;'},children:[{namespace:this.svgUrl,element:'path',attributes:{d:'M78.28,21.72 50,50 78.28,78.28 64.14,92.43 35.86,64.14 21.72,50 35.86,35.86 64.14,7.57Z',fill:'#fff',stroke:'#000'}}]},next:{namespace:this.svgUrl,element:'svg',attributes:{width:'48',height:'48',viewBox:'0 0 100 100',style:'position:absolute;top:50%;right:2%;'},children:[{namespace:this.svgUrl,element:'path',attributes:{d:'M21.72,21.72 50,50 21.72,78.28 35.86,92.43 64.14,64.14 78.28,50 64.14,35.86 35.86,7.57Z',fill:'#fff',stroke:'#000'}}]},exit:{namespace:this.svgUrl,element:'svg',attributes:{width:'64',height:'64',viewBox:'0 0 100 100',style:'position:absolute;top:0;left:0;'},children:[{namespace:this.svgUrl,element:'path',attributes:{d:'M78.28,7.57 50,35.86 21.72,7.57 7.57,21.72 35.86,50 7.57,78.28 21.72,92.43 50,64.14 78.28,92.43 92.43,78.28 64.14,50 92.43,21.72Z',fill:'#fff',stroke:'#000'}}]},hide:{namespace:this.svgUrl,element:'svg',attributes:{width:'48',height:'48',viewBox:'0 0 100 100',style:'position:absolute;top:0;left:0;'},children:[{namespace:this.svgUrl,element:'path',attributes:{d:'M21.72,21.72 50,50 78.28,21.72 92.43,35.86 64.14,64.14 50,78.28 35.86,64.14 7.57,35.86Z',fill:'#fff',stroke:'#000'}}]},goto:{namespace:this.svgUrl,element:'svg',attributes:{width:'48',height:'48',viewBox:'0 0 100 100',style:'position:absolute;top:0;left:0;'},children:[{namespace:this.svgUrl,element:'path',attributes:{d:'M20 20L20 40 60 40 60 80 80 80 80 40 80 20 60 20 20 20Z M20 60L20 80 40 80 40 60 20 60Z',fill:'#fff',stroke:'#000'}}]}};     

        constructor() {
            this.HTMLElems.container = this.nodeFactory({element:'div',attributes:{class:this.settings.lightboxClass,style:'width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:900;background-color:rgba(0,0,0,.8);backdrop-filter:blur(3px);'}});
            this.HTMLElems.prevBtn = this.nodeFactory({element:'button',event:{trigger:'click',release:this.prevSlideEvent.bind(this)},attributes:{class:this.settings.lightboxClass+'__prev-btn',style:'width:40%;height:100vh;position:absolute;z-index:11;border:0;border-radius:0;cursor:pointer;top:0;left:0;background:0;'},children:[this.svgFig.prev]}, this.HTMLElems.container);
            this.HTMLElems.nextBtn = this.nodeFactory({element:'button',event:{trigger:'click',release:this.nextSlideEvent.bind(this)},attributes:{class:this.settings.lightboxClass+'__next-btn',style:'width:40%;height:100vh;position:absolute;z-index:11;border:0;border-radius:0;cursor:pointer;top:0;right:0;background:0;'},children:[this.svgFig.next]}, this.HTMLElems.container);
            this.HTMLElems.exitBtn = this.nodeFactory({element:'button',event:{trigger:'click',release:this.exitSlideEvent.bind(this)},attributes:{class:this.settings.lightboxClass+'__exit-btn',style:'width:64px;height:64px;position:absolute;z-index:12;border:0;border-radius:0;cursor:pointer;top:0;right:0;background:0;'},children:[this.svgFig.exit]}, this.HTMLElems.container);
            this.HTMLElems.heroImage = this.nodeFactory({element:'img',attributes:{class:this.settings.lightboxClass+'__hero',style:'max-width:95vw;max-height:95vh;position:absolute;top:50%;left:50%;z-index:10;transform:translate(-50%,-50%);'}}, this.HTMLElems.container);
            this.HTMLElems.infoContainer = this.nodeFactory({element:'div',attributes:{class:this.settings.lightboxClass+'__info-container',style:'min-width:96px;padding:15px;position:absolute;left:0;bottom:0;z-index:40;background-color:rgba(255,255,255,.6);'}}, this.HTMLElems.container);
            this.HTMLElems.heroTitle = this.nodeFactory({element:'div',attributes:{class:this.settings.lightboxClass+'__hero-title',style:'font-size:22px;color:#000;'}}, this.HTMLElems.infoContainer);
            this.HTMLElems.galleryName = this.nodeFactory({element:'div',attributes:{class:this.settings.lightboxClass+'__gallery-name',style:'font-size:18px;color:#000;'}}, this.HTMLElems.infoContainer);
            this.HTMLElems.counter = this.nodeFactory({element:'div',attributes:{class:this.settings.lightboxClass+'__counter',style:'font-size:32px;color:#000;'}}, this.HTMLElems.infoContainer);
            this.HTMLElems.infoToggle = this.nodeFactory({element:'button',event:{trigger:'click',release:this.toggleInfoContainer.bind(this)},attributes:{class:this.settings.lightboxClass+'__info-toggle',style:'width:48px;height:48px;position:absolute;top:-48px;left:0;cursor:pointer;border-radius:0;border:0;background-color:rgba(255,255,255,.6);'},children:[this.svgFig.hide]}, this.HTMLElems.infoContainer);
            this.HTMLElems.gotoImage = this.nodeFactory({element:'a',attributes:{class:this.settings.lightboxClass+'__img-href',href:'',target:'_blank',style:'width:48px;height:48px;position:absolute;top:-48px;left:48px;background-color:rgba(255,255,255,.6);'},children:[this.svgFig.goto]}, this.HTMLElems.infoContainer);
        }

        init() { this.setHeroImage(this.gallery[this.currentIndex]); }
        appendLightbox() { document.body.appendChild(this.HTMLElems.container); }
        setCurrentIndex(index) { this.currentIndex = index; }
        setGallery(gallery) { this.gallery = gallery; }

        setHeroImage(src) {
            this.HTMLElems.heroImage.setAttribute('src', src.href);
            this.HTMLElems.galleryName.innerHTML = src.dataset.gallery;
            if(src.children[0].title) this.HTMLElems.heroTitle.innerHTML = src.children[0].title;
            else if(src.title) this.HTMLElems.heroTitle.innerHTML = src.title;
            this.HTMLElems.counter.innerHTML = (this.currentIndex + 1) + '/' + this.gallery.length;
            this.HTMLElems.gotoImage.href = src.href;
        }

        prevSlideEvent() {
            if(this.gallery.length > 1) {
                this.currentIndex--;
                if(this.currentIndex < 0) this.currentIndex = this.gallery.length - 1;
                this.setHeroImage(this.gallery[this.currentIndex]);
            }
        }
        nextSlideEvent() {
            if(this.gallery.length > 1) {
                this.currentIndex++;
                if(this.currentIndex >= this.gallery.length) this.currentIndex = 0;
                this.setHeroImage(this.gallery[this.currentIndex]);
            }
        }
        exitSlideEvent() {
            document.body.removeChild(this.HTMLElems.container);
        }

        toggleInfoContainer() {
            if(this.HTMLElems.infoContainer.style.transform !== 'translateY(100%)') {
                this.HTMLElems.infoContainer.style.transform = 'translateY(100%)';
                this.HTMLElems.infoToggle.children[0].style.transform = 'rotate(180deg)';
            }
            else {
                this.HTMLElems.infoContainer.style.transform = 'translateY(0)';
                this.HTMLElems.infoToggle.children[0].style.transform = 'rotate(0)';
            }
        }

        nodeFactory(nodeData = {}, parent = null) {
            let node = document.createElementNS(nodeData.namespace || 'http://www.w3.org/1999/xhtml', nodeData.element);
            if(parent) parent.appendChild(node);
            if(nodeData.event) node.addEventListener(nodeData.event.trigger, nodeData.event.release);
            if(nodeData.attributes) {
                for(const attribute in nodeData.attributes) node.setAttribute(attribute, nodeData.attributes[attribute]);
            }
            if(nodeData.children) {
                nodeData.children.forEach(child => this.nodeFactory(child, node));
            }

            return node;
        }
    }

    function launchGallery(event) {
        let galleryName = this.dataset.gallery.toString();
        let gallery = items.filter((item) => item.dataset.gallery.toString() == galleryName);
        let index = gallery.findIndex((item) => item == this);

        lightbox.setGallery(gallery);
        lightbox.setCurrentIndex(index);
        lightbox.init();
        lightbox.appendLightbox();
        event.preventDefault();
    }

    let lightbox = new Lightbox();
    const items = [].slice.call(document.querySelectorAll('a[data-gallery]'));
    if(items) {
        items.forEach(item => {
            item.addEventListener('click', launchGallery);
        });
    }
})();