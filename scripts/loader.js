MyGame = {
    systems: {},
    render: {},
    assets: {},
    screens: {},
    input: {},
    objects: {},
    sounds: {},
    data: {},
    levels: {},
};

//------------------------------------------------------------------
//
// Purpose of this code is to bootstrap (maybe I should use that as the name)
// the rest of the application.  Only this file is specified in the index.html
// file, then the code in this file gets all the other code and assets
// loaded.
//
//------------------------------------------------------------------
MyGame.loader = (function () {
    'use strict';
    let scriptOrder = [{
        scripts: ['sounds'],
        message: 'Sound Manager loaded',
        onComplete: null
    },
    {
        scripts: ['game'],
        message: 'Game Scene selector loaded',
        onComplete: null
    },
    {
        scripts: ['render/core'],
        message: 'Rendering core loaded',
        onComplete: null
    },
    {
        scripts: ['render/animated-model'],
        message: 'Rendering animated-model loaded',
        onComplete: null
    },
    {
        scripts: ['kb-input'],
        message: 'Keyboard Input loaded',
        onComplete: null
    },
    {
        scripts: ['mouse-input'],
        message: 'Mouse Input loaded',
        onComplete: null
    },
    {
        scripts: ['objects/gameboard'],
        message: 'Gameboard Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/magic'],
        message: 'Gameboard Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/particles'],
        message: 'Particles Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/assetParticles'],
        message: 'Asset Particles Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/laser'],
        message: 'Pew Pew Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/missiles'],
        message: 'Bew Bew Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/info'],
        message: 'Info Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/cursor'],
        message: 'Cursor Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/enemies'],
        message: 'Enemies Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/towers'],
        message: 'Towers Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/path'],
        message: 'Path Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/waves'],
        message: 'Wave Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/bombs'],
        message: 'Bombs Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/menu'],
        message: 'Menu Loaded',
        onComplete: null
    },
    {
        scripts: ['objects/healthbar'],
        message: 'Healthbars Loaded',
        onComplete: null
    },
    {
        scripts: ['screens/mainmenu'],
        message: 'Main menu loaded',
        onComplete: null
    },
    {
        scripts: ['screens/settings'],
        message: 'Settings loaded',
        onComplete: null
    },
    {
        scripts: ['screens/about'],
        message: 'About Page loaded',
        onComplete: null
    },
    {
        scripts: ['screens/highscores'],
        message: 'Highscore Page loaded',
        onComplete: null
    },
    {
        scripts: ['screens/levelselect'],
        message: 'Level select Page loaded',
        onComplete: null
    },
    {
        scripts: ['screens/gameplay'],
        message: 'Game loop and model loaded',
        onComplete: null
    }];

    let assetOrder = [{
        key: 'snow',
        source: '/assets/snow.png'
    }, {
        key: 'snow_imprint',
        source: '/assets/snow_imprint.png'
    }, {
        key: 'buy_cell',
        source: '/assets/buy_cell.png'
    }, {
        key: 'wall',
        source: '/assets/wall.png'
    }, {
        key: 'coin',
        source: '/assets/coin.png'
    }, {
        key: 'life',
        source: '/assets/life.png'
    }, {
        key: 'Wall_base',
        source: '/assets/wall.png'
    }, {
        key: 'Wall_3_0',
        source: '/assets/wall.png'
    }, {
        key: 'Turret_base',
        source: '/assets/tower-base.png'
    }, {
        key: 'Turret_3_0',
        source: '/assets/basic-turret-1.png'
    }, {
        key: 'Turret_0_1',
        source: '/assets/basic-turret-2.png'
    }, {
        key: 'Turret_0_2',
        source: '/assets/basic-turret-3.png'
    }, {
        key: 'Turret_0_3',
        source: '/assets/basic-turret-4.png'
    }, {
        key: 'Turret_1_1',
        source: '/assets/basic-turret-5.png'
    }, {
        key: 'Turret_1_2',
        source: '/assets/basic-turret-6.png'
    }, {
        key: 'Turret_1_3',
        source: '/assets/basic-turret-7.png'
    }, {
        key: 'Turret_2_1',
        source: '/assets/basic-turret-8.png'
    }, {
        key: 'Turret_2_2',
        source: '/assets/basic-turret-9.png'
    }, {
        key: 'Turret_2_3',
        source: '/assets/basic-turret-10.png'
    },{
        key: 'Launcher_base',
        source: '/assets/launcher-base.png'
    }, {
        key: 'Launcher_3_0',
        source: '/assets/launcher-1.png'
    }, {
        key: 'Launcher_0_1',
        source: '/assets/launcher-2.png'
    }, {
        key: 'Launcher_0_2',
        source: '/assets/launcher-3.png'
    }, {
        key: 'Launcher_0_3',
        source: '/assets/launcher-4.png'
    }, {
        key: 'Launcher_1_1',
        source: '/assets/launcher-5.png'
    }, {
        key: 'Launcher_1_2',
        source: '/assets/launcher-6.png'
    }, {
        key: 'Launcher_1_3',
        source: '/assets/launcher-7.png'
    }, {
        key: 'Launcher_2_1',
        source: '/assets/launcher-8.png'
    }, {
        key: 'Launcher_2_2',
        source: '/assets/launcher-9.png'
    }, {
        key: 'Launcher_2_3',
        source: '/assets/launcher-10.png'
    },{
        key: 'Ringtrap_base',
        source: '/assets/blank.png'
    }, {
        key: 'Ringtrap_3_0',
        source: '/assets/ringtrap-1.png'
    }, {
        key: 'Ringtrap_0_1',
        source: '/assets/ringtrap-2.png'
    }, {
        key: 'Ringtrap_0_2',
        source: '/assets/ringtrap-3.png'
    }, {
        key: 'Ringtrap_0_3',
        source: '/assets/ringtrap-4.png'
    }, {
        key: 'Ringtrap_1_1',
        source: '/assets/ringtrap-5.png'
    }, {
        key: 'Ringtrap_1_2',
        source: '/assets/ringtrap-6.png'
    }, {
        key: 'Ringtrap_1_3',
        source: '/assets/ringtrap-7.png'
    }, {
        key: 'Ringtrap_2_1',
        source: '/assets/ringtrap-8.png'
    }, {
        key: 'Ringtrap_2_2',
        source: '/assets/ringtrap-9.png'
    }, {
        key: 'Ringtrap_2_3',
        source: '/assets/ringtrap-10.png'
    },{
        key: 'Bomb_base',
        source: '/assets/bomb-base.png'
    }, {
        key: 'Bomb_3_0',
        source: '/assets/bomb-1.png'
    }, {
        key: 'Bomb_0_1',
        source: '/assets/bomb-2.png'
    }, {
        key: 'Bomb_0_2',
        source: '/assets/bomb-3.png'
    }, {
        key: 'Bomb_0_3',
        source: '/assets/bomb-4.png'
    }, {
        key: 'Bomb_1_1',
        source: '/assets/bomb-5.png'
    }, {
        key: 'Bomb_1_2',
        source: '/assets/bomb-6.png'
    }, {
        key: 'Bomb_1_3',
        source: '/assets/bomb-7.png'
    }, {
        key: 'Bomb_2_1',
        source: '/assets/bomb-8.png'
    }, {
        key: 'Bomb_2_2',
        source: '/assets/bomb-9.png'
    }, {
        key: 'Bomb_2_3',
        source: '/assets/bomb-10.png'
    }, {
        key: 'MachineGun_base',
        source: '/assets/machinegun-base.png'
    }, {
        key: 'MachineGun_3_0',
        source: '/assets/machinegun-1.png'
    }, {
        key: 'MachineGun_0_1',
        source: '/assets/machinegun-2.png'
    }, {
        key: 'MachineGun_0_2',
        source: '/assets/machinegun-3.png'
    }, {
        key: 'MachineGun_0_3',
        source: '/assets/machinegun-4.png'
    }, {
        key: 'MachineGun_1_1',
        source: '/assets/machinegun-5.png'
    }, {
        key: 'MachineGun_1_2',
        source: '/assets/machinegun-6.png'
    }, {
        key: 'MachineGun_1_3',
        source: '/assets/machinegun-7.png'
    }, {
        key: 'MachineGun_2_1',
        source: '/assets/machinegun-8.png'
    }, {
        key: 'MachineGun_2_2',
        source: '/assets/machinegun-9.png'
    }, {
        key: 'MachineGun_2_3',
        source: '/assets/machinegun-10.png'
    },{
        key: 'AirTower_base',
        source: '/assets/air-base.png'
    }, {
        key: 'AirTower_3_0',
        source: '/assets/air-1.png'
    }, {
        key: 'AirTower_0_1',
        source: '/assets/air-2.png'
    }, {
        key: 'AirTower_0_2',
        source: '/assets/air-3.png'
    }, {
        key: 'AirTower_0_3',
        source: '/assets/air-4.png'
    }, {
        key: 'AirTower_1_1',
        source: '/assets/air-5.png'
    }, {
        key: 'AirTower_1_2',
        source: '/assets/air-6.png'
    }, {
        key: 'AirTower_1_3',
        source: '/assets/air-7.png'
    }, {
        key: 'AirTower_2_1',
        source: '/assets/air-8.png'
    }, {
        key: 'AirTower_2_2',
        source: '/assets/air-9.png'
    }, {
        key: 'AirTower_2_3',
        source: '/assets/air-10.png'
    },{
        key: 'Trigun_base',
        source: '/assets/trigun-base.png'
    }, {
        key: 'Trigun_3_0',
        source: '/assets/trigun-1.png'
    }, {
        key: 'Trigun_0_1',
        source: '/assets/trigun-2.png'
    }, {
        key: 'Trigun_0_2',
        source: '/assets/trigun-3.png'
    }, {
        key: 'Trigun_0_3',
        source: '/assets/trigun-4.png'
    }, {
        key: 'Trigun_1_1',
        source: '/assets/trigun-5.png'
    }, {
        key: 'Trigun_1_2',
        source: '/assets/trigun-6.png'
    }, {
        key: 'Trigun_1_3',
        source: '/assets/trigun-7.png'
    }, {
        key: 'Trigun_2_1',
        source: '/assets/trigun-8.png'
    }, {
        key: 'Trigun_2_2',
        source: '/assets/trigun-9.png'
    }, {
        key: 'Trigun_2_3',
        source: '/assets/trigun-10.png'
    },{
        key: 'Wisp',
        source: '/assets/wisp.png'
        
    },{
        key: 'bomb',
        source: '/assets/bomb.png'
        
    },{
        key: 'Drone',
        source: '/assets/drone.png'
    },{

        key: 'Cube',
        source: '/assets/cube.png'
    }, {
        key: 'Spider',
        source: '/assets/spider.png'
    }, {
        key: 'laser_basic',
        source: '/assets/laser.png'
    }, {
        key: 'laser_black',
        source: '/assets/laser-black.png'
    },{
        key: 'laser_ice',
        source: '/assets/laser-ice.png'
    }, {
        key: 'laser_acid',
        source: '/assets/laser-acid.png'
    },{
        key: 'missile',
        source: '/assets/missile.png'
    },  {
        key: 'playBtnHover',
        source: '/assets/play-hover.png'
    }, {
        key: 'playBtn',
        source: '/assets/play.png'
    }, {
        key: 'pauseBtnHover',
        source: '/assets/pause-hover.png'
    }, {
        key: 'pauseBtn',
        source: '/assets/pause.png'
    }, {
        key: 'wave',
        source: '/assets/play.png'
    }, {
        key: 'waveHover',
        source: '/assets/play-hover.png'
    },
    ];

    let levelOrder = [{
        key: 'level1',
        source: 'levels/level1.json'
    },{
        key: 'level2',
        source: 'levels/level2.json'
    },{
        key: 'level3',
        source: 'levels/level3.json'
    },{
        key: 'level4',
        source: 'levels/level4.json'
    },{
        key: 'level5',
        source: 'levels/level5.json'
    },]

    let soundOder = [
        {
            key: 'menu_hover',
            source: '/soundFX/menu-hover.wav'
        },{
            key: 'deny',
            source: '/soundFX/deny.wav'
        },{
            key: 'sell',
            source: '/soundFX/sell.wav'
        },{
            key: 'death',
            source: '/soundFX/death.wav'
        },{
            key: 'upgrade1',
            source: '/soundFX/upgrade1.wav'
        },{
            key: 'upgrade2',
            source: '/soundFX/upgrade2.wav'
        },{
            key: 'upgrade3',
            source: '/soundFX/upgrade3.wav'
        },{
            key: 'place',
            source: '/soundFX/towerplace.wav'
        },{
            key: 'boom',
            source: '/soundFX/boom.wav'
        },{
            key: 'fire',
            source: '/soundFX/fire.wav'
        },{
            key: 'ice_cave',
            source: '/soundFX/IceCaveV6.wav'
        },
    ]

    //------------------------------------------------------------------
    //
    // Helper function used to load scripts in the order specified by the
    // 'scripts' parameter.  'scripts' expects an array of objects with
    // the following format...
    //    {
    //        scripts: [script1, script2, ...],
    //        message: 'Console message displayed after loading is complete',
    //        onComplete: function to call when loading is complete, may be null
    //    }
    //
    //------------------------------------------------------------------
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function () {
                //console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.shift();    // Alternatively: scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // Helper function used to load assets in the order specified by the
    // 'assets' parameter.  'assets' expects an array of objects with
    // the following format...
    //    {
    //        key: 'asset-1',
    //        source: 'asset/.../asset.png'
    //    }
    //
    // onSuccess is invoked per asset as: onSuccess(key, asset)
    // onError is invoked per asset as: onError(error)
    // onComplete is invoked once per 'assets' array as: onComplete()
    //
    //------------------------------------------------------------------
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    assets.shift();    // Alternatively: assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';

            xhr.onload = function () {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3' || fileExtension === 'wav') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    if (xhr.responseType === 'blob') {
                        if (fileExtension === 'mp3' || fileExtension === 'wav') {
                            asset.oncanplaythrough = function () {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        else {  // not terrific assumption that it has an 'onload' event, but that is what we are doing
                            asset.onload = function () {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        asset.src = window.URL.createObjectURL(xhr.response);
                    }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }

    function loadData() {
        let savedData = localStorage.getItem('data');
        if (savedData !== null) {
            MyGame.data = JSON.parse(savedData);
        }
        else {
            MyGame.data = {
                controls: {
                    startWave: { label: 'Start Wave', key: 'g' },
                    sell: { label: 'Sell Tower', key: 's' },
                    upgrade1: { label: 'Upgrade Path 1', key: '1' },
                    upgrade2: { label: 'Upgrade Path 2', key: '2' },
                    upgrade3: { label: 'Upgrade Path 3', key: '3' },
                    grid: { label: 'Toggle Grid', key: 'h' },
                    path: { label: 'Toggle Path', key: 'p' },
                },
                volume: .3,
                togglePath: true,
                toggleGrid: true,
                score: {},
            }
            for (let level in MyGame.levels) {
                MyGame.data.score[level] = [0, 0, 0, 0, 0];
            }
            localStorage['data'] = JSON.stringify(MyGame.data);
        }
    }

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    function loadLevels(levels, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (levels.length > 0) {
            let entry = levels[0];
            loadLevel(entry.source,
                function (asset) {
                    onSuccess(entry, asset);
                    levels.shift(); 
                    loadLevels(levels, onSuccess, onError, onComplete);
                },
                function (error) {
                    onError(error);
                    levels.shift();
                    loadLevels(levels, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    function loadLevel(level, onSuccess, onError){
        readTextFile(level, function(text){
            let result = JSON.parse(text);
            onSuccess(result);
        })
    }

    //------------------------------------------------------------------
    //
    // Called when all the scripts are loaded, it kicks off the demo app.
    //
    //------------------------------------------------------------------
    function mainComplete() {
        console.log('It is all loaded up');
        MyGame.game.initialize();
    }

    console.log('Loading Levels');
    loadLevels(levelOrder,
        function (source, level) {
            MyGame.levels[source.key] = level;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log("All levels loaded");
            console.log('Loading saved data');
            loadData();
            loadSounds(soundOder);
        }
    );

    function loadSounds(soundOder){
        for (let idx in soundOder){
            MyGame.assets[soundOder[idx].key] = soundOder[idx].source;
        }
    }
    

    //
    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function (source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function (error) {
            console.log(error);
        },
        function () {
            console.log('All game assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

}());
