import Phaser from "phaser";

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
  "💭 Première journée d'école à Lille... La nouvelle vie commence !",
  "💭 Un petit appart de 13m carrés, le grand luxe!",
  "💭 Soirées et sorties entre amis, la folie!",
  "💭 J'intègre une super asso humanitaire, Les Enfants d'Apsara !",
  "💭 Voyager seul et découvrir le monde... liberté totale, et une vraie révélation!",
  "💭 Ma famille est loin, mais je pense fort à eux ❤️"
];

const loveMemories = [
  "💕 2e année d'école, qui démarre par le forum des associations, pour recruter les nouveaux...",
  "💕 Et là... Notre première rencontre, nos premiers sourirs...",
  "💕 Notre premier café ensemble ☕",
  "💕 Une aventure amoureuse qui démarre ✨",
  "💕 5 ans de bonheur plus tard, à Lille, Paris, et aux 4 coins du monde EMOJI ",
  "💕 Un voyage à New York, et une petite surprise au bout : tu as dit 'oui' ! 💍",
  "💕 Notre voyage de noces sous le soleil de Marrakech 🏝️",
  "💕 La construction de notre nid d'amour 🏠"
];

// Scène du menu principal
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('menuBg', 'assets/ecran1.jpeg');
  }

  create() {
    // Arrière-plan romantique
    this.add.image(960, 600, 'menuBg').setDisplaySize(1920, 1200);

    // Titre du jeu avec cœurs
    // Ajustement de la position Y
    const title = this.add.text(960, 200, '💖 L\'AVENTURE DE L\'AMOUR 💖', {
      fontSize: '80px',
      fill: '#ff69b4',
      fontFamily: 'Arial Black',
      stroke: '#ffffff',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Panneau de fond pour les textes d'information
    // Cela rend le texte plus lisible sur l'image de fond
    const infoPanel = this.add.rectangle(960, 390, 1200, 300, 0x000000, 0.4) // x, y, largeur, hauteur, couleur, opacité
        .setStrokeStyle(4, 0xffffff, 0.6)
        .setCornerRadius(15);


    // Histoire du jeu
    // Ajustement de la position Y et de la taille de police
    this.add.text(960, 310, 'Suivez l\'histoire d\'un homme qui va rencontrer l\'amour de sa vie', {
      fontSize: '32px', // Légèrement plus grand
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(960, 350, 'et découvrir ensemble le plus beau des cadeaux... 👶✨', {
      fontSize: '32px', // Légèrement plus grand
      fill: '#ffdd44',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Instructions
    // Ajustement de la position Y et de la taille de police
    this.add.text(960, 430, '🎮 Explorez, ouvrez des coffres, découvrez vos souvenirs !', {
      fontSize: '30px', // Légèrement plus grand
      fill: '#87ceeb'
    }).setOrigin(0.5);

    this.add.text(960, 470, '⚠️ Évitez les petits monstres sur votre chemin !', {
      fontSize: '30px', // Légèrement plus grand
      fill: '#ffa500'
    }).setOrigin(0.5);

    // Boutons du menu
    // Ajustement des positions Y pour les espacer correctement
    this.createButton(960, 650, '🚀 COMMENCER L\'AVENTURE', () => {
      gameState = {
        score: 0, level: 1, lives: 3, memories: 0,
        hasMetGirl: false, foundBaby: false, currentStory: 'beginning'
      };
      this.scene.start('GameScene');
    });
    this.createButton(960, 770, '📖 HISTOIRE', () => { // Plus bas
      this.showStory();
    });
    this.createButton(960, 890, '⚙️ CRÉDITS', () => { // Encore plus bas
      this.showCredits();
    });

    // Animation du titre
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // La fonction createButton a été ajustée
  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    // Dimensions du bouton ajustées pour la nouvelle résolution
    const bg = this.add.rectangle(0, 0, 500, 90, 0xff69b4, 0.9) // Plus grand et plus épais
      .setStrokeStyle(5, 0xffffff, 1) // Bordure plus épaisse et opaque
      .setCornerRadius(20); // Coins plus arrondis pour un look plus moderne

    const buttonText = this.add.text(0, 0, text, {
      fontSize: '38px', // Taille du texte ajustée
      fill: '#ffffff',
      fontFamily: 'Arial Bold',
      shadow: { // Ombre sur le texte des boutons
        offsetX: 4,
        offsetY: 4,
        color: '#000000',
        blur: 6,
        fill: true
      }
    }).setOrigin(0.5);

    button.add([bg, buttonText]);

    bg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.setFillStyle(0xe91e63, 1);
        this.tweens.add({ targets: button, scaleX: 1.1, scaleY: 1.1, duration: 150 }); // Zoom plus prononcé
        this.game.canvas.style.cursor = 'pointer';
      })
      .on('pointerout', () => {
        bg.setFillStyle(0xff69b4, 0.9);
        this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 150 });
        this.game.canvas.style.cursor = 'default';
      })
      .on('pointerdown', callback);

    return button;
  }

  showStory() {
    // Ajustez les dimensions et positions des éléments du panneau d'histoire
    const overlay = this.add.rectangle(960, 600, 1920, 1200, 0x000000, 0.8);
    const panel = this.add.rectangle(960, 600, 1400, 900, 0x1a2a3a, 0.95) // Panneau plus grand
      .setStrokeStyle(4, 0x87ceeb, 1) // Bordure plus épaisse
      .setCornerRadius(15);

    this.add.text(960, 220, '📖 L\'HISTOIRE', { // Position Y ajustée
      fontSize: '60px', // Plus grand
      fill: '#ff69b4',
      fontFamily: 'Arial Black',
      shadow: { color: '#000000', blur: 8, offsetX: 4, offsetY: 4 } // Ombre ajustée
    }).setOrigin(0.5);

    const storyText = [
      "🚶‍♂️ Chapitre 1: Un homme seul découvre la vie",
      "🎓 Chapitre 2: Rencontre magique à l'université",
      "👫 Chapitre 3: L'amour grandit jour après jour",
      "👶 Chapitre 4: Le plus beau des cadeaux",
      "", // Ligne vide pour espacer
      "L'aventure de la vie vous attend ! Chaque rencontre,",
      "chaque découverte est un pas vers un bonheur inattendu.",
      "Trouvez les souvenirs pour avancer et éviter les obstacles.",
      "Le plus grand trésor est celui que l'on construit ensemble."
    ];

    storyText.forEach((text, index) => {
      this.add.text(960, 350 + (index * 45), text, { // Positions ajustées, espacement ajusté
        fontSize: '28px', // Ajusté
        fill: '#ffffff',
        fontFamily: 'Arial',
        wordWrap: { width: 1300 }, // Largeur de texte ajustée
        shadow: { color: '#000000', blur: 3, offsetX: 2, offsetY: 2 } // Ombre ajustée
      }).setOrigin(0.5);
    });

    this.add.text(960, 800, '✨ Chaque coffre révèle un souvenir précieux ✨', { // Position ajustée
      fontSize: '24px', // Ajusté
      fill: '#ffdd44',
      shadow: { color: '#000000', blur: 3, offsetX: 2, offsetY: 2 } // Ombre ajustée
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(960, 950, 250, 70, 0xe74c3c) // Bouton plus grand
      .setInteractive({ useHandCursor: true })
      .setCornerRadius(15) // Coins arrondis
      .on('pointerdown', () => {
        overlay.destroy();
        panel.destroy();
        closeBtn.destroy();
        this.children.getByName('storyCloseText')?.destroy();
      })
      .on('pointerover', () => { this.game.canvas.style.cursor = 'pointer'; })
      .on('pointerout', () => { this.game.canvas.style.cursor = 'default'; });

    this.add.text(960, 950, 'FERMER', {
      fontSize: '32px', // Ajusté
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setName('storyCloseText');
  }

  showCredits() {
    // Ajustez les dimensions et positions des éléments du panneau de crédits
    const overlay = this.add.rectangle(960, 600, 1920, 1200, 0x000000, 0.8);
    const panel = this.add.rectangle(960, 600, 1100, 700, 0x1a2a3a, 0.95) // Taille et couleur ajustées
      .setStrokeStyle(4, 0x87ceeb, 1) // Bordure plus épaisse
      .setCornerRadius(15);

    this.add.text(960, 300, '💖 CRÉDITS', { // Position Y ajustée
      fontSize: '60px', // Plus grand
      fill: '#ff69b4',
      fontFamily: 'Arial Black',
      shadow: { color: '#000000', blur: 8, offsetX: 4, offsetY: 4 } // Ombre ajustée
    }).setOrigin(0.5);

    this.add.text(960, 420, 'Une histoire d\'amour interactive', { // Position Y ajustée
      fontSize: '32px', // Ajusté
      fill: '#ffffff',
      fontFamily: 'Arial',
      shadow: { color: '#000000', blur: 3, offsetX: 2, offsetY: 2 } // Ombre ajustée
    }).setOrigin(0.5);

    this.add.text(960, 480, 'Développé avec 💕 et Phaser 3', { // Position Y ajustée
      fontSize: '30px', // Ajusté
      fill: '#ffdd44',
      fontFamily: 'Arial',
      shadow: { color: '#000000', blur: 3, offsetX: 2, offsetY: 2 }
    }).setOrigin(0.5);

    this.add.text(960, 540, 'Pour célébrer la famille 👨‍👩‍👶', { // Position Y ajustée
      fontSize: '30px', // Ajusté
      fill: '#87ceeb',
      fontFamily: 'Arial',
      shadow: { color: '#000000', blur: 3, offsetX: 2, offsetY: 2 }
    }).setOrigin(0.5);

    const closeBtn = this.add.rectangle(960, 750, 250, 70, 0xe74c3c) // Bouton plus grand
      .setInteractive({ useHandCursor: true })
      .setCornerRadius(15)
      .on('pointerdown', () => {
        overlay.destroy();
        panel.destroy();
        closeBtn.destroy();
        this.children.getByName('creditsCloseText')?.destroy();
      })
      .on('pointerover', () => { this.game.canvas.style.cursor = 'pointer'; })
      .on('pointerout', () => { this.game.canvas.style.cursor = 'default'; });

    this.add.text(960, 750, 'FERMER', {
      fontSize: '32px', // Ajusté
      fill: '#ffffff',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5).setName('creditsCloseText');
  }
}

// Scène de jeu principal
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Si vous gardez les assets par défaut (basse résolution), ils seront étirés et potentiellement pixélisés
    // IL EST FORTEMENT RECOMMANDÉ DE REMPLACER CES ASSETS PAR DES VERSIONS HAUTE RÉSOLUTION (ou des tilesets pour le sol)
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/platform.png');
    this.load.spritesheet('dude', 'https://labs.phaser.io/assets/dude.png', {
      frameWidth: 32, // Ces dimensions sont pour le spritesheet basse résolution
      frameHeight: 48 // Si vous avez un spritesheet Dude haute résolution, changez-les ici
    });
    this.load.image('chest', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    this.load.image('monster', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Arrière-plan (sera étiré si l'image est petite)
    this.add.image(960, 600, 'sky').setDisplaySize(1920, 1200); // Ajusté à la nouvelle résolution

    // Titre du niveau
    this.add.text(960, 80, '🚶‍♂️ Chapitre 1: L\'aventure commence', { // Position Y ajustée
      fontSize: '40px', // Ajusté
      fill: '#ffffff',
      fontFamily: 'Arial Bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Plateformes (leurs positions et tailles doivent être adaptées à la nouvelle résolution)
    // Les valeurs setScale sont des multiplicateurs. Si 'ground' est petite, l'étirement la rendra floue.
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(960, 1150, 'ground').setScale(6, 2).refreshBody(); // Plus grand et plus bas
    this.platforms.create(300, 700, 'ground').setScale(2, 1); // Ajusté
    this.platforms.create(1200, 600, 'ground').setScale(2, 1); // Ajusté
    this.platforms.create(1700, 400, 'ground').setScale(2, 1); // Ajusté

    // Joueur (position initiale ajustée)
    this.player = this.physics.add.sprite(200, 900, 'dude'); // Position ajustée
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Créer les coffres aux trésors (positions ajustées)
    this.createChests();

    // Créer les petits monstres (positions ajustées)
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
    const chestPositions = [
      { x: 300, y: 650 }, // Ajusté
      { x: 1200, y: 550 }, // Ajusté
      { x: 1700, y: 350 } // Ajusté
    ];

    chestPositions.forEach((pos, index) => {
      const chest = this.add.rectangle(pos.x, pos.y, 80, 60, 0xffd700) // Plus grand
        .setStrokeStyle(4, 0xff8c00); // Plus épais

      const sparkle = this.add.text(pos.x, pos.y - 40, '✨', { // Position ajustée
        fontSize: '32px' // Plus grand
      }).setOrigin(0.5);

      this.tweens.add({
        targets: sparkle, alpha: 0.3, duration: 1000, yoyo: true, repeat: -1
      });
      chest.setInteractive().on('pointerdown', () => this.openChest(chest, sparkle, index));
      this.chests.add(chest);
    });
    this.physics.add.overlap(this.player, this.chests, (player, chest) => {
      const index = this.chests.children.entries.indexOf(chest);
      this.openChest(chest, null, index);
    });
  }

  createMonsters() {
    this.monsters = this.physics.add.group();
    const monsterPositions = [
      { x: 700, y: 1000 }, // Ajusté
      { x: 1500, y: 1000 } // Ajusté
    ];

    monsterPositions.forEach(pos => {
      const monster = this.add.text(pos.x, pos.y, '👾', {
        fontSize: '48px' // Plus grand
      }).setOrigin(0.5);

      this.physics.add.existing(monster);
      monster.body.setVelocityX(Phaser.Math.Between(-100, 100)); // Vitesse ajustée
      monster.body.setBounce(1);
      monster.body.setCollideWorldBounds(true);
      this.monsters.add(monster);
    });
    this.physics.add.collider(this.monsters, this.platforms);
    this.physics.add.overlap(this.player, this.monsters, this.hitMonster, null, this);
  }

  openChest(chest, sparkle, index) {
    if (chest.opened) return;
    chest.opened = true;
    chest.setFillStyle(0x8B4513);
    if (sparkle) sparkle.destroy();

    const memory = memories[index] || "💭 Un beau souvenir !";
    this.showMemory(memory);

    gameState.memories++;
    gameState.score += 100;

    if (gameState.memories >= 3) {
      this.time.delayedCall(3000, () => {
        this.scene.start('UniversityScene');
      });
    }
  }

  showMemory(text) {
    const memoryPanel = this.add.rectangle(960, 200, 1000, 120, 0x000000, 0.8) // Ajusté
      .setStrokeStyle(4, 0xffd700); // Plus épais

    const memoryText = this.add.text(960, 200, text, {
      fontSize: '28px', // Ajusté
      fill: '#ffdd44',
      fontFamily: 'Arial',
      wordWrap: { width: 900 } // Ajusté
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      memoryPanel.destroy();
      memoryText.destroy();
    });
  }

  hitMonster(player, monster) {
    this.tweens.add({
      targets: player, alpha: 0.5, duration: 100, yoyo: true, repeat: 3
    });
    gameState.lives--;
    if (gameState.lives <= 0) { this.gameOver(); }
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
        const text = this.add.text(960, 150, encouragements[currentIndex], { // Position Y ajustée
          fontSize: '32px', // Ajusté
          fill: '#87ceeb',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);

        this.time.delayedCall(2500, () => {
          text.destroy(); currentIndex++;
          if (currentIndex < encouragements.length) { this.time.delayedCall(500, showNext); }
        });
      }
    };
    showNext();
  }

  createUI() {
    // Panneau d'interface utilisateur (UI)
    const uiPanel = this.add.rectangle(180, 80, 320, 120, 0x000000, 0.7) // Position et taille ajustées
      .setStrokeStyle(3, 0xffffff); // Plus épais

    this.scoreText = this.add.text(50, 40, `Score: ${gameState.score}`, { // Position ajustée
      fontSize: '28px', // Ajusté
      fill: '#ffffff'
    });

    this.memoriesText = this.add.text(50, 80, `Souvenirs: ${gameState.memories}/3`, { // Position ajustée
      fontSize: '28px', // Ajusté
      fill: '#ffdd44'
    });

    this.livesText = this.add.text(50, 120, `Vies: ${gameState.lives}`, { // Position ajustée
      fontSize: '28px', // Ajusté
      fill: '#ff6b6b'
    });

    // Bouton pause
    const pauseBtn = this.add.rectangle(1920 - 100, 80, 150, 60, 0x34495e) // Position et taille ajustées
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.pause();
        this.scene.launch('PauseScene');
      });

    this.add.text(1920 - 100, 80, 'PAUSE', { // Position ajustée
      fontSize: '28px', // Ajusté
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  update() {
    // Vitesses du joueur ajustées pour la nouvelle résolution
    if (this.cursors.left.isDown) { this.player.setVelocityX(-320); } // Vitesse doublée
    else if (this.cursors.right.isDown) { this.player.setVelocityX(320); } // Vitesse doublée
    else { this.player.setVelocityX(0); }

    if (this.cursors.up.isDown && this.player.body.touching.down) { this.player.setVelocityY(-800); } // Saut plus haut

    this.updateUI();
  }

  gameOver() {
    this.add.text(960, 600, 'GAME OVER', { // Position ajustée
      fontSize: '80px', // Ajusté
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
    this.add.rectangle(960, 600, 1920, 1200, 0x87ceeb); // Ajusté à la nouvelle résolution

    // Titre
    this.add.text(960, 150, '🎓 À l\'Université - Rencontre Magique', { // Position Y ajustée
      fontSize: '60px', // Ajusté
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

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
        const text = this.add.text(960, 450, scenes[currentScene], { // Position Y ajustée
          fontSize: '40px', // Ajusté
          fill: '#ff69b4',
          fontFamily: 'Arial Bold',
          stroke: '#ffffff',
          strokeThickness: 3
        }).setOrigin(0.5);

        text.setAlpha(0);
        this.tweens.add({
          targets: text, alpha: 1, duration: 1000,
          onComplete: () => {
            this.time.delayedCall(2000, () => {
              this.tweens.add({
                targets: text, alpha: 0, duration: 500,
                onComplete: () => {
                  text.destroy(); currentScene++;
                  if (currentScene < scenes.length) { this.time.delayedCall(500, showNextScene); }
                  else { this.showContinueButton(); }
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

    this.add.text(960, 700, '💕 Votre histoire d\'amour commence ! 💕', { // Position Y ajustée
      fontSize: '50px', // Ajusté
      fill: '#ff1493',
      fontFamily: 'Arial Bold'
    }).setOrigin(0.5);

    const continueBtn = this.add.rectangle(960, 850, 450, 90, 0xff69b4) // Bouton plus grand
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('EndingScene');
      });

    this.add.text(960, 850, '✨ DÉCOUVRIR LE TRÉSOR ✨', {
      fontSize: '32px', // Ajusté
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
    this.add.rectangle(960, 600, 1920, 1200, 0x2c3e50); // Ajusté

    // Étoiles scintillantes
    for (let i = 0; i < 80; i++) { // Plus d'étoiles pour un plus grand écran
      const star = this.add.text(
        Phaser.Math.Between(0, 1920), // Ajusté
        Phaser.Math.Between(0, 800), // Ajusté
        '✨',
        { fontSize: '20px' } // Ajusté
      );
      this.tweens.add({
        targets: star, alpha: 0.3, duration: Phaser.Math.Between(1000, 3000), yoyo: true, repeat: -1
      });
    }

    // Titre final
    this.add.text(960, 250, '🎉 LE PLUS BEAU DES TRÉSORS 🎉', { // Ajusté
      fontSize: '70px', // Ajusté
      fill: '#ffd700',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Coffre magique final
    const finalChest = this.add.rectangle(960, 400, 120, 90, 0xffd700) // Ajusté
      .setStrokeStyle(6, 0xff8c00); // Ajusté

    const magicSparkles = this.add.text(960, 350, '✨ ✨ ✨', { // Ajusté
      fontSize: '48px' // Ajusté
    }).setOrigin(0.5);

    this.tweens.add({ targets: magicSparkles, y: 320, duration: 1000, yoyo: true, repeat: -1 });

    this.time.delayedCall(2000, () => {
      finalChest.destroy(); magicSparkles.destroy();

      const baby = this.add.text(960, 450, '👶', { // Ajusté
        fontSize: '120px' // Ajusté
      }).setOrigin(0.5);

      const finalMessage = this.add.text(960, 600, 'Félicitations ! Votre famille est maintenant complète ! 💕', { // Ajusté
        fontSize: '40px', // Ajusté
        fill: '#ff69b4',
        fontFamily: 'Arial Bold'
      }).setOrigin(0.5);

      const endMessage = this.add.text(960, 680, 'L\'aventure continue... dans la vraie vie ! 👨‍👩‍👶', { // Ajusté
        fontSize: '32px', // Ajusté
        fill: '#87ceeb'
      }).setOrigin(0.5);

      this.time.delayedCall(3000, () => {
        const restartBtn = this.add.rectangle(960, 850, 400, 80, 0x27ae60) // Ajusté
          .setStrokeStyle(3, 0xffffff)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
            gameState = {
              score: 0, level: 1, lives: 3, memories: 0,
              hasMetGirl: false, foundBaby: false, currentStory: 'beginning'
            };
            this.scene.start('MenuScene');
          });

        this.add.text(960, 850, '🔄 REJOUER L\'AVENTURE', {
          fontSize: '32px', // Ajusté
          fill: '#ffffff',
          fontFamily: 'Arial Bold'
        }).setOrigin(0.5);
      });
    });
  }
}

// Scène de pause
class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    // Ajustez les dimensions et positions des éléments du panneau de pause
    this.add.rectangle(960, 600, 1920, 1200, 0x000000, 0.7);
    const panel = this.add.rectangle(960, 600, 800, 600, 0x2c3e50, 0.95) // Panneau plus grand
      .setStrokeStyle(4, 0xffffff); // Bordure plus épaisse

    this.add.text(960, 450, '⏸️ PAUSE', { // Position Y ajustée
      fontSize: '70px', // Plus grand
      fill: '#ffffff'
    }).setOrigin(0.5);

    const continueBtn = this.add.rectangle(960, 600, 350, 80, 0x4a90e2) // Bouton plus grand
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.resume('GameScene');
      });

    this.add.text(960, 600, 'CONTINUER', {
      fontSize: '32px', // Ajusté
      fill: '#ffffff'
    }).setOrigin(0.5);

    const menuBtn = this.add.rectangle(960, 720, 350, 80, 0xe74c3c) // Bouton plus grand, position Y ajustée
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop();
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
      });

    this.add.text(960, 720, 'MENU PRINCIPAL', {
      fontSize: '32px', // Ajusté
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

// Configuration du jeu
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1200,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: false } // Gravité ajustée pour le saut plus haut
  },
  scene: [MenuScene, GameScene, UniversityScene, EndingScene, PauseScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: false
  }
};

// Lancement du jeu
new Phaser.Game(config);