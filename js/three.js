/* ===== THREE.JS - Visor 3D ===== */
(function() {
    'use strict';
    
    // Verificar si Three.js está disponible
    if (typeof THREE === 'undefined') {
        console.warn('⚠️ Three.js no cargado. El visor 3D no estará disponible.');
        return;
    }
    
    const container = document.getElementById('three-container');
    const placeholder = document.getElementById('three-placeholder');
    
    if (!container) return;
    
    // ===== CONFIGURACIÓN =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // ===== LUCES =====
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xfdcc6e, 0.3);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);
    
    // ===== MODELOS =====
    let currentModel = null;
    let currentModelType = 'camisa';
    
    // Crear modelos con Three.js básicos (sin carga externa)
    function createShirt() {
        const group = new THREE.Group();
        
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.4, metalness: 0.1 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.4), bodyMat);
        body.position.y = 0.2;
        body.castShadow = true;
        group.add(body);
        
        const neckMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.5, metalness: 0.1 });
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.15), neckMat);
        neck.position.set(0, 0.9, 0.15);
        group.add(neck);
        
        const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.4, metalness: 0.1 });
        const sleeveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.15), sleeveMat);
        sleeveLeft.position.set(-0.8, 0.3, 0);
        sleeveLeft.rotation.z = -0.3;
        group.add(sleeveLeft);
        
        const sleeveRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.15), sleeveMat);
        sleeveRight.position.set(0.8, 0.3, 0);
        sleeveRight.rotation.z = 0.3;
        group.add(sleeveRight);
        
        return group;
    }
    
    function createPants() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.6, metalness: 0.05 });
        
        const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.65, 0.2, 16), mat);
        waist.position.y = 0.1;
        waist.castShadow = true;
        group.add(waist);
        
        const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 1.2, 12), mat);
        legLeft.position.set(-0.25, -0.6, 0);
        legLeft.castShadow = true;
        group.add(legLeft);
        
        const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 1.2, 12), mat);
        legRight.position.set(0.25, -0.6, 0);
        legRight.castShadow = true;
        group.add(legRight);
        
        return group;
    }
    
    function createJacket() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.6, metalness: 0.2 });
        
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 0.5), mat);
        body.position.y = 0.1;
        body.castShadow = true;
        group.add(body);
        
        const neckMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.6, metalness: 0.2 });
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.2), neckMat);
        neck.position.set(0, 0.85, 0.2);
        group.add(neck);
        
        const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, roughness: 0.6, metalness: 0.2 });
        const sleeveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.2), sleeveMat);
        sleeveLeft.position.set(-0.85, 0.3, 0);
        sleeveLeft.rotation.z = -0.25;
        group.add(sleeveLeft);
        
        const sleeveRight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.7, 0.2), sleeveMat);
        sleeveRight.position.set(0.85, 0.3, 0);
        sleeveRight.rotation.z = 0.25;
        group.add(sleeveRight);
        
        return group;
    }
    
    function changeModel(type) {
        if (currentModel) {
            scene.remove(currentModel);
        }
        
        switch(type) {
            case 'camisa': currentModel = createShirt(); break;
            case 'pantalon': currentModel = createPants(); break;
            case 'chaqueta': currentModel = createJacket(); break;
            default: currentModel = createShirt();
        }
        
        scene.add(currentModel);
        currentModelType = type;
    }
    
    changeModel('camisa');
    
    // ===== CONTROLES =====
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Touch
    let touchStart = null;
    renderer.domElement.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });
    
    renderer.domElement.addEventListener('touchmove', function(e) {
        if (!touchStart || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    
    renderer.domElement.addEventListener('touchend', function() {
        touchStart = null;
    }, { passive: true });
    
    // ===== BOTONES DE MODELO =====
    const modelButtons = document.querySelectorAll('.preview-3d__btn');
    modelButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            modelButtons.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            const model = btn.getAttribute('data-model');
            if (model) {
                changeModel(model);
                targetRotation = { x: 0, y: 0 };
                currentRotation = { x: 0, y: 0 };
            }
        });
    });
    
    // ===== ANIMACIÓN =====
    function animate() {
        requestAnimationFrame(animate);
        
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
        
        if (currentModel) {
            currentModel.rotation.x = currentRotation.x;
            currentModel.rotation.y = currentRotation.y;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // ===== REDIMENSIONAR =====
    function resizeRenderer() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }
    
    window.addEventListener('resize', resizeRenderer);
    
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(function() { resizeRenderer(); });
        resizeObserver.observe(container);
    }
    
    console.log('✅ Visor 3D iniciado correctamente');
})();