import Phaser from "phaser";

// Configuration du jeu
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 400 }, debug: false }
  },
  scene: [MenuScene, GameScene, UniversityScene, EndingScene, PauseScene]
};

// État du jeu et histoire
let gameState = {
  score: 0,
  level: 1,
  lives: 3,
  memories: 0,
  hasMetGirl: false,
  foundBaby: false,
  currentStory: 'beginning'
};

// Messages et souvenirs à découvrir
const memories = [
  "💭 Premier jour de travail... Je me sens nerveux !",
  "💭 Cette présentation s'est bien passée !",
  "💭 Un week-end entre amis, que de rires !",
  "💭 Cette promotion, je l'ai méritée !",
  "💭 Voyager seul... liberté totale !",
  "💭 Mes parents sont fiers de moi ❤️"
];

const loveMemories = [
  "💕 Nos premiers regards à la bibliothèque...",
  "💕 Notre premier café ensemble ☕",
  "💕 Cette balade sous les étoiles ✨",
  "💕 Quand tu as dit 'oui' ! 💍",
  "💕 Notre voyage de noces 🏝️",
  "💕 Construire notre nid d'amour 🏠"
];

// Scène du menu principal
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('menuBg', 'https://labs.phaser.io/assets/skies/gradient.png');
  }

  create() {
    // Arrière-plan romantique
    this.add.image(512, 384, 'menuBg').setScale(2);
    
    // Titre du jeu avec cœurs
    const title = this.add.text(512, 180, '💖 L\'AVENTURE DE L\'AMOUR 💖', {
      fontSize: '48px',
      fill: '#ff69b4',
      fontFamily: 'Arial Black',
      stroke: '#ffffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Histoire du jeu
    this.add.text(512, 250, 'Suivez l\'histoire d\'un homme qui va rencontrer l\'amour de sa vie', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(512, 280, 'et découvrir ensemble le plus beau des cadeaux... 👶✨', {
      fontSize: '20px',
      fill: '#ffdd44',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(512, 340, '🎮 Explorez, ouvrez des coffres, découvrez vos souvenirs !', {
      fontSize: '18px',
      fill: '#87ceeb'
    }).setOrigin(0.5);

    this.add.text(512, 365, '⚠️ Évitez les petits monstres sur votre chemin !', {
      fontSize: '18px',
      fill: '#ffa500'
    }).setOrigin(0.5);

    // Boutons du menu
    this.createButton(512, 450, '🚀 COMMENCER L\'AVENTURE', () => {
      this.scene.start('GameScene');
    });

    this.createButton(512, 520, '📖 HISTOIRE', () => {
      this.showStory();
    });

    this.createButton(512, 590, '⚙️ CRÉDITS', () => {
      this.showCredits();
    });

    // Animation du titre
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 350, 50, 0xff69b4, 0.8)
      .setStrokeStyle(3, 0xffffff);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    
    bg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.setFillStyle(0xe91e63);
        this.tweens.add({ targets: button, scaleX: 1.05, scaleY: 1.05, duration: 100 });
      })
      .on('pointerout', () => {
        bg.setFillStyle(0xff69b4);
        this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 100 });
      })
      .on('pointerdown', callback);

    return button;
  }

  showStory() {
    const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
    const panel = this.add.rectangle(512, 384, 700, 500, 0x2c3e50, 0.95)
      .setStrokeStyle(3, 0xffffff);
    
    this.add.text(512, 200, '📖 L\'HISTOIRE', {
      fontSize: '32px',
      fill: '#ff69b4'
    }).setOrigin(0.5);

    const storyText = [
      "🚶‍♂️ Chapitre 1: Un homme seul découvre la vie",
      "🎓 Chapitre 2: Rencontre magique à l'université", 
      "👫 Chapitre 3: L'amour grandit jour après jour",
      "👶 Chapitre 4: Le plus beau des cadeaux"
    ];

    storyText.forEach((text, index) => {
      this.add.text(512, 280 + (index * 40), text, {
        fontSize: '18px',
        fill: '#ffffff'
      }).setOrigin(0.5);
    });

    this.add.text(512, 500, '✨ Chaque coffre révèle un souvenir précieux ✨', {
      fontSize: '16px',
      fill: '#ffdd44'
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(512, 580, 150, 40, 0xe74c3c)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        overlay.destroy();
        panel.destroy();
        closeBtn.destroy();
      });

    this.add.text(512, 580, 'FERMER', {
      fontSize: '16px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  showCredits() {
    const overlay = this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.8);
    const panel = this.add.rectangle(512, 384, 600, 400, 0x2c3e50, 0.95)
      .setStrokeStyle(3, 0xffffff);
    
    this.add.text(512, 250, '💖 CRÉDITS', {
      fontSize: '36px',
      fill: '#ff69b4'
    }).setOrigin(0.5);

    this.add.text(512, 320, 'Une histoire d\'amour interactive', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(512, 360, 'Développé avec 💕 et Phaser 3', {
      fontSize: '18px',
      fill: '#ffdd44'
    }).setOrigin(0.5);

    this.add.text(512, 400, 'Pour célébrer la famille 👨‍👩‍👶', {
      fontSize: '18px',
      fill: '#87ceeb'
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(512, 480, 150, 40, 0xe74c3c)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        overlay.destroy();
        panel.destroy();
        closeBtn.destroy();
      });

    this.add.text(512, 480, 'FERMER', {
      fontSize: '16px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

// Scène de jeu principal
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    // Créer des images colorées pour les objets du jeu
    this.load.image('chest', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    this.load.image('monster', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Arrière-plan
    this.add.image(512, 384, 'sky').setScale(1.3);
    
    // Titre du niveau
    this.add.text(512, 50, '🚶‍♂️ Chapitre 1: L\'aventure commence', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Plateformes
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(512, 750, 'ground').setScale(2.5, 1).refreshBody();
    this.platforms.create(200, 500, 'ground');
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(900, 300, 'ground');

    // Joueur
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Créer les coffres aux trésors
    this.createChests();
    
    // Créer les petits monstres
    this.createMonsters();

    // Contrôles
    this.cursors = this.input.keyboard.createCursorKeys();

    // Interface utilisateur
    this.createUI();

    // Messages d'encouragement
    this.showEncouragement();
  }

  createChests() {
    this.chests = this.physics.add.staticGroup();
    
    // Positions des coffres
    const chestPositions = [
      { x: 200, y: 450 },
      { x: 600, y: 350 },
      { x: 900, y: 250 }
    ];

    chestPositions.forEach((pos, index) => {
      const chest = this.add.rectangle(pos.x, pos.y, 40, 30, 0xffd700)
        .setStrokeStyle(2, 0xff8c00);
      
      // Ajouter un effet de brillance
      const sparkle = this.add.text(pos.x, pos.y - 20, '✨', {
        fontSize: '16px'
      }).setOrigin(0.5);

      // Animation de brillance
      this.tweens.add({
        targets: sparkle,
        alpha: 0.3,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      chest.setInteractive()
        .on('pointerdown', () => this.openChest(chest, sparkle, index));
      
      this.chests.add(chest);
    });

    // Collision avec le joueur
    this.physics.add.overlap(this.player, this.chests, (player, chest) => {
      const index = this.chests.children.entries.indexOf(chest);
      this.openChest(chest, null, index);
    });
  }

  createMonsters() {
    this.monsters = this.physics.add.group();
    
    // Créer quelques petits monstres rigolos
    const monsterPositions = [
      { x: 400, y: 600 },
      { x: 750, y: 600 }
    ];

    monsterPositions.forEach(pos => {
      const monster = this.add.text(pos.x, pos.y, '👾', {
        fontSize: '24px'
      }).setOrigin(0.5);
      
      this.physics.add.existing(monster);
      monster.body.setVelocityX(Phaser.Math.Between(-50, 50));
      monster.body.setBounce(1);
      monster.body.setCollideWorldBounds(true);
      
      this.monsters.add(monster);
    });

    // Collision monstre-plateforme
    this.physics.add.collider(this.monsters, this.platforms);
    
    // Collision joueur-monstre
    this.physics.add.overlap(this.player, this.monsters, this.hitMonster, null, this);
  }

  openChest(chest, sparkle, index) {
    if (chest.opened) return;
    
    chest.opened = true;
    chest.setFillStyle(0x8B4513); // Marron pour coffre ouvert
    if (sparkle) sparkle.destroy();

    // Afficher le souvenir
    const memory = memories[index] || "💭 Un beau souvenir !";
    this.showMemory(memory);
    
    gameState.memories++;
    gameState.score += 100;

    // Vérifier si tous les coffres sont ouverts
    if (gameState.memories >= 3) {
      this.time.delayedCall(3000, () => {
        this.scene.start('UniversityScene');
      });
    }
  }

  showMemory(text) {
    const memoryPanel = this.add.rectangle(512, 150, 600, 80, 0x000000, 0.8)
      .setStrokeStyle(2, 0xffd700);
    
    const memoryText = this.add.text(512, 150, text, {
      fontSize: '18px',
      fill: '#ffdd44',
      fontFamily: 'Arial',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);

    // Faire disparaître après 3 secondes
    this.time.delayedCall(3000, () => {
      memoryPanel.destroy();
      memoryText.destroy();
    });
  }

  hitMonster(player, monster) {
    // Effet de clignotement
    this.tweens.add({
      targets: player,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3
    });

    gameState.lives--;
    if (gameState.lives <= 0) {
      this.gameOver();
    }
  }

  showEncouragement() {
    const encouragements = [
      "Explorez et découvrez vos souvenirs ! 💭",
      "Attention aux petits monstres ! 👾",
      "Ouvrez tous les coffres pour continuer ! ✨"
    ];

    let currentIndex = 0;
    const showNext = () => {
      if (currentIndex < encouragements.length) {
        const text = this.add.text(512, 100, encouragements[currentIndex], {
          fontSize: '20px',
          fill: '#87ceeb',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);

        this.time.delayedCall(2500, () => {
          text.destroy();
          currentIndex++;
          if (currentIndex < encouragements.length) {
            this.time.delayedCall(500, showNext);
          }
        });
      }
    };
    showNext();
  }

  createUI() {
    // Panneau d'interface
    const uiPanel = this.add.rectangle(120, 50, 220, 80, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffffff);

    this.scoreText = this.add.text(30, 25, `Score: ${gameState.score}`, {
      fontSize: '16px',
      fill: '#ffffff'
    });

    this.memoriesText = this.add.text(30, 45, `Souvenirs: ${gameState.memories}/3`, {
      fontSize: '16px',
      fill: '#ffdd44'
    });

    this.livesText = this.add.text(30, 65, `Vies: ${gameState.lives}`, {
      fontSize: '16px',
      fill: '#ff6b6b'
    });

    // Bouton pause
    const pauseBtn = this.add.rectangle(950, 50, 100, 40, 0x34495e)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.pause();
        this.scene.launch('PauseScene');
      });

    this.add.text(950, 50, 'PAUSE', {
      fontSize: '16px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  update() {
    // Contrôles du joueur
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Mise à jour de l'interface
    this.updateUI();
  }

  updateUI() {
    this.scoreText.setText(`Score: ${gameState.score}`);
    this.memoriesText.setText(`Souvenirs: ${gameState.memories}/3`);
    this.livesText.setText(`Vies: ${gameState.lives}`);
  }

  gameOver() {
    this.add.text(512, 384, 'GAME OVER', {
      fontSize: '48px',
      fill: '#ff0000'
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.scene.start('MenuScene');
    });
  }
}

// Scène de l'université
class UniversityScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UniversityScene' });
  }

  create() {
    // Arrière-plan universitaire
    this.add.rectangle(512, 384, 1024, 768, 0x87ceeb);
    
    // Titre
    this.add.text(512, 100, '🎓 À l\'Université - Rencontre Magique', {
      fontSize: '32px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Animation de la rencontre
    this.showLoveStory();
  }

  showLoveStory() {
    const scenes = [
      "📚 Dans la bibliothèque, vos regards se croisent...",
      "☕ Un café ensemble, les premiers mots...",
      "💝 Les sentiments grandissent jour après jour...",
      "💍 La demande en mariage sous les étoiles...",
      "👰‍♀️🤵‍♂️ Le plus beau jour de votre vie !",
      "🏠 Construire votre nid d'amour ensemble..."
    ];

    let currentScene = 0;
    const showNextScene = () => {
      if (currentScene < scenes.length) {
        const text = this.add.text(512, 300, scenes[currentScene], {
          fontSize: '24px',
          fill: '#ff69b4',
          fontFamily: 'Arial Bold',
          stroke: '#ffffff',
          strokeThickness: 2
        }).setOrigin(0.5);

        // Effet d'apparition
        text.setAlpha(0);
        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 1000,
          onComplete: () => {
            this.time.delayedCall(2000, () => {
              this.tweens.add({
                targets: text,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                  text.destroy();
                  currentScene++;
                  if (currentScene < scenes.length) {
                    showNextScene();
                  } else {
                    this.showContinueButton();
                  }
                }
              });
            });
          }
        });
      }
    };

    showNextScene();
  }

  showContinueButton() {
    gameState.hasMetGirl = true;
    
    this.add.text(512, 400, '💕 Votre histoire d\'amour commence ! 💕', {
      fontSize: '28px',
      fill: '#ff1493',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);

    const continueBtn = this.add.rectangle(512, 500, 300, 60, 0xff69b4)
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('EndingScene');
      });

    this.add.text(512, 500, '✨ DÉCOUVRIR LE TRÉSOR ✨', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);
  }
}

// Scène finale
class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndingScene' });
  }

  create() {
    // Arrière-plan magique
    this.add.rectangle(512, 384, 1024, 768, 0x2c3e50);
    
    // Étoiles scintillantes
    for (let i = 0; i < 50; i++) {
      const star = this.add.text(
        Phaser.Math.Between(0, 1024),
        Phaser.Math.Between(0, 400),
        '✨',
        { fontSize: '12px' }
      );
      
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }

    // Titre final
    this.add.text(512, 150, '🎉 LE PLUS BEAU DES TRÉSORS 🎉', {
      fontSize: '36px',
      fill: '#ffd700',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Coffre magique final
    const finalChest = this.add.rectangle(512, 300, 80, 60, 0xffd700)
      .setStrokeStyle(4, 0xff8c00);

    const magicSparkles = this.add.text(512, 250, '✨ ✨ ✨', {
      fontSize: '24px'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: magicSparkles,
      y: 230,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Révélation finale
    this.time.delayedCall(2000, () => {
      finalChest.destroy();
      magicSparkles.destroy();
      
      const baby = this.add.text(512, 300, '👶', {
        fontSize: '64px'
      }).setOrigin(0.5);

      const finalMessage = this.add.text(512, 400, 'Félicitations ! Votre famille est maintenant complète ! 💕', {
        fontSize: '24px',
        fill: '#ff69b4',
        fontFamily: 'Arial Bold'
      }).setOrigin(0.5);

      const endMessage = this.add.text(512, 450, 'L\'aventure continue... dans la vraie vie ! 👨‍👩‍👶', {
        fontSize: '20px',
        fill: '#87ceeb'
      }).setOrigin(0.5);

      // Bouton recommencer
      this.time.delayedCall(3000, () => {
        const restartBtn = this.add.rectangle(512, 550, 250, 50, 0x27ae60)
          .setStrokeStyle(3, 0xffffff)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
            // Reset du jeu
            gameState = {
              score: 0,
              level: 1,
              lives: 3,
              memories: 0,
              hasMetGirl: false,
              foundBaby: false,
              currentStory: 'beginning'
            };
            this.scene.start('MenuScene');
          });

        this.add.text(512, 550, '🔄 REJOUER L\'AVENTURE', {
          fontSize: '18px',
          fill: '#ffffff',
          fontFamily: 'Arial Bold'
        }).setOrigin(0.5);
      });
    });
  }
}

// Scène de pause (simplifiée)
class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.add.rectangle(512, 384, 1024, 768, 0x000000, 0.7);
    const panel = this.add.rectangle(512, 384, 400, 300, 0x2c3e50, 0.95)
      .setStrokeStyle(3, 0xffffff);

    this.add.text(512, 280, '⏸️ PAUSE', {
      fontSize: '36px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const continueBtn = this.add.rectangle(512, 360, 200, 45, 0x4a90e2)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
      });

    this.add.text(512, 360, 'CONTINUER', {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const menuBtn = this.add.rectangle(512, 420, 200, 45, 0xe74c3c)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
      });

    this.add.text(512, 420, 'MENU PRINCIPAL', {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

// Lancement du jeu
new Phaser.Game(config);