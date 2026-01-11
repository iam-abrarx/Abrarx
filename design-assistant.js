(function() {
    // State
    const state = {
        active: true,
        showRulers: true,
        showCoords: true,
        mouseX: 0,
        mouseY: 0
    };

    // DOM Elements
    let overlay, rulerH, rulerV, coordsDisplay, controlPanel;

    // Initialization
    function init() {
        createStyles();
        createOverlay();
        createControls();
        bindEvents();
        renderRulers();
        toggleTool(true); // Start active
    }

    function createStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'design-assistant.css';
        document.head.appendChild(link);
    }

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'design-assistant-overlay';
        
        // Rulers
        rulerH = document.createElement('div');
        rulerH.className = 'da-ruler da-ruler-h';
        
        rulerV = document.createElement('div');
        rulerV.className = 'da-ruler da-ruler-v';
        
        overlay.appendChild(rulerH);
        overlay.appendChild(rulerV);
        
        // Coords
        coordsDisplay = document.createElement('div');
        coordsDisplay.id = 'da-coords';
        coordsDisplay.textContent = 'X: 0, Y: 0';
        
        document.body.appendChild(overlay);
        document.body.appendChild(coordsDisplay);
    }

    function createControls() {
        controlPanel = document.createElement('div');
        controlPanel.id = 'da-control-panel';
        
        // Toggle Rulers Button
        const btnRulers = createButton('toggle-rulers', '📏 Rulers', state.showRulers);
        btnRulers.addEventListener('click', () => toggleRulers());
        
        // Toggle Coords Button
        const btnCoords = createButton('toggle-coords', '🎯 Coords', state.showCoords);
        btnCoords.addEventListener('click', () => toggleCoords());
        
        // Close Button (Minimize)
        const btnClose = createButton('toggle-tool', '✕ Hide Tool', false);
        btnClose.addEventListener('click', () => toggleTool(false));
        
        controlPanel.appendChild(btnRulers);
        controlPanel.appendChild(btnCoords);
        // controlPanel.appendChild(btnClose); // Optional: keep it simple for now
        
        document.body.appendChild(controlPanel);
    }

    function createButton(id, text, isActive) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        if (isActive) btn.classList.add('active');
        return btn;
    }

    function renderRulers() {
        // Clear existing
        rulerH.innerHTML = '';
        rulerV.innerHTML = '';
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Horizontal Ruler
        for (let i = 0; i < width; i += 5) {
            const tick = document.createElement('div');
            tick.className = 'da-tick';
            tick.style.left = i + 'px';
            
            if (i % 100 === 0) {
                tick.classList.add('major');
                const label = document.createElement('div');
                label.className = 'da-label';
                label.textContent = i;
                label.style.left = i + 'px';
                rulerH.appendChild(label);
            } else if (i % 10 === 0) {
                tick.classList.add('minor');
            } else {
                tick.classList.add('micro');
            }
            rulerH.appendChild(tick);
        }
        
        // Vertical Ruler
        for (let i = 0; i < height; i += 5) {
            const tick = document.createElement('div');
            tick.className = 'da-tick';
            tick.style.top = i + 'px';
            
            if (i % 100 === 0) {
                tick.classList.add('major');
                const label = document.createElement('div');
                label.className = 'da-label';
                label.textContent = i;
                label.style.top = i + 'px';
                rulerV.appendChild(label);
            } else if (i % 10 === 0) {
                tick.classList.add('minor');
            } else {
                tick.classList.add('micro');
            }
            rulerV.appendChild(tick);
        }
    }

    function bindEvents() {
        window.addEventListener('resize', () => {
             renderRulers();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (state.showCoords) {
                updateCoords(e.clientX, e.clientY);
            }
        });
        
        // Keyboard shortcut: Ctrl+Shift+D to toggle tool
        // document.addEventListener('keydown', (e) => {
        //     if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        //         toggleTool(!state.active);
        //     }
        // });
    }

    function updateCoords(x, y) {
        state.mouseX = x;
        state.mouseY = y;
        coordsDisplay.textContent = `X: ${x}, Y: ${y}`;
    }

    function toggleRulers() {
        state.showRulers = !state.showRulers;
        const btn = document.getElementById('toggle-rulers');
        
        if (state.showRulers) {
            overlay.classList.add('active');
            btn.classList.add('active');
        } else {
            overlay.classList.remove('active');
            btn.classList.remove('active');
        }
    }

    function toggleCoords() {
        state.showCoords = !state.showCoords;
        const btn = document.getElementById('toggle-coords');
        
        if (state.showCoords) {
            coordsDisplay.classList.add('active');
            document.body.classList.add('da-tracking');
            btn.classList.add('active');
            // Update immediately in case mouse isn't moving
            updateCoords(state.mouseX, state.mouseY);
        } else {
            coordsDisplay.classList.remove('active');
            document.body.classList.remove('da-tracking');
            btn.classList.remove('active');
        }
    }

    function toggleTool(active) {
        state.active = active;
        if (active) {
            if (state.showRulers) overlay.classList.add('active');
            if (state.showCoords) coordsDisplay.classList.add('active');
            if (state.showCoords) document.body.classList.add('da-tracking');
        } else {
            overlay.classList.remove('active');
            coordsDisplay.classList.remove('active');
            document.body.classList.remove('da-tracking');
        }
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
