import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('image1', 'assets/image1.png');
  this.load.image('image4', 'assets/image4.png');
  this.load.image('image5', 'assets/image5.png');
  this.load.image('image6', 'assets/image6.png');
  this.load.image('arrow', 'assets/image7.png'); // Aşağı yukarı ok simgesi
  this.load.image('image8', 'assets/image8.png'); // Aşağı yukarı ok simgesi
  this.load.image('image9', 'assets/image9.png');
  this.load.image('image10', 'assets/image10.png');
  this.load.image('image11', 'assets/image11.png');
  this.load.image('image12', 'assets/image12.png');
  this.load.image('image13', 'assets/image13.png');
  this.load.image('image14', 'assets/image14.png');
}

function create() {
  const { width, height } = this.scale;

  this.background = this.add.image(width / 2, height / 2, 'image1');
  resizeBackground(this.background, width, height);

  // Tüm resimlerin ortak konumu
  const commonX = width / 2;
  const commonY = height / 2 + 100;

  this.smallImg1 = this.add.image(width / 2, height / 2 + 50, 'image4').setDisplaySize(1500, 800);
  
  // Ana resim
  this.smallImg2 = this.add.image(commonX, commonY, 'image11')
    .setDisplaySize(600, 400);
  
  // Alternatif görüntüler (temiz/kirli durumlar için)
  this.cleanImg = this.add.image(commonX, commonY, 'image5')
    .setDisplaySize(600, 400)
    .setVisible(false);

  this.dirtyImg = this.add.image(commonX, commonY, 'image12')
    .setDisplaySize(600, 400)
    .setVisible(false);

  // Kontrol değişkenleri
  this.image9Attached = false;
  this.image10Attached = false;
  this.isEnvironmentClean = false;

  // M tuşu için durum kontrolü
  this.mKey = this.input.keyboard.addKey('M');
  this.statusText = this.add.text(width - 20, 20, 'Ortam Kirli', { 
    fontSize: '24px', 
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 }
  })
  .setScrollFactor(0)
  .setDepth(1000)
  .setOrigin(1, 0)  // Sağ üst köşeye hizala
  .setVisible(true);

  // M tuşuna basıldığında genel ortam durumunu değiştir
  this.mKey.on('down', () => {
    this.isEnvironmentClean = !this.isEnvironmentClean;
    this.statusText.setText(this.isEnvironmentClean ? 'Ortam Temiz' : 'Ortam Kirli');

    // Eğer image6 kullanıldıysa göstergeleri güncelle
    if (this.image13.visible || this.image14.visible) {
      if (this.isEnvironmentClean) {
        this.image13.setVisible(true);
        this.image14.setVisible(false);
      } else {
        this.image13.setVisible(false);
        this.image14.setVisible(true);
      }
    }

    // Eğer parçalar takılıysa, görüntüyü ortam durumuna göre güncelle
    if (this.image9Attached && this.image10Attached) {
      if (this.isEnvironmentClean) {
        this.cleanImg.setVisible(true);
        this.dirtyImg.setVisible(false);
      } else {
        this.cleanImg.setVisible(false);
        this.dirtyImg.setVisible(true);
      }
    }
  });

  // Envanter için değişkenler
  this.inventoryOpen = false;
  this.inventorySlots = [];
  const inventoryHeight = 200;
  const slotSize = 50;
  const slotSpacing = 10;
  const inventoryY = height - inventoryHeight;

  // Envanter slotlarını oluştur
  for (let i = 0; i < 8; i++) {
    const slotX = width / 2 - (slotSize * 4) + (i * (slotSize + slotSpacing));
    const slot = this.add.rectangle(slotX, inventoryY + inventoryHeight, slotSize, slotSize, 0x000000, 0.5);
    slot.setInteractive();
    this.inventorySlots.push(slot);
  }

  // Envanter öğelerini tanımla
  const inventoryItems = [
    { key: 'image6', slot: 0 }, // smallImg3 için
    { key: 'image8', slot: 1 },  // smallImg4 için
    { key: 'image9', slot: 2},
    { key: 'image10', slot: 3},
  ];

  // Envanter öğelerini oluştur ve özellikleri uygula
  this.inventoryImages = inventoryItems.map((item, index) => {
    const img = this.add.image(
      this.inventorySlots[item.slot].x,
      inventoryY + (slotSize / 2),
      item.key
    ).setDisplaySize(slotSize, slotSize);

    img.setInteractive();
    img.setVisible(false);

    // Sürükleme olaylarını ekle
    img.on('drag', (pointer) => {
      img.x = pointer.x;
      img.y = pointer.y;
    });

    img.on('pointerdown', (pointer) => {
      img.setAlpha(0.5);
      this.input.setDraggable(img);
      img.setDisplaySize(350, 200);
    });

    img.on('pointerup', () => {
      const image5Bounds = {
        x: this.smallImg2.x - this.smallImg2.displayWidth / 2,
        y: this.smallImg2.y - this.smallImg2.displayHeight / 2,
        width: this.smallImg2.displayWidth,
        height: this.smallImg2.displayHeight
      };

      if (img.x > image5Bounds.x && 
          img.x < image5Bounds.x + image5Bounds.width &&
          img.y > image5Bounds.y && 
          img.y < image5Bounds.y + image5Bounds.height) {
        
        // Image6 kullanıldığında durum göstergelerini güncelle
        if (item.key === 'image6') {
          // Ortam durumuna göre uygun göstergeyi göster
          if (this.isEnvironmentClean) {
            this.image13.setVisible(true);
            this.image14.setVisible(false);
          } else {
            this.image13.setVisible(false);
            this.image14.setVisible(true);
          }
        }
        // Image8 kullanıldığında ortamı temizle
        else if (item.key === 'image8') {
          this.isEnvironmentClean = true;
          this.statusText.setText('Ortam Temiz');
          
          // Eğer image6 kullanıldıysa göstergeleri güncelle
          if (this.image13.visible || this.image14.visible) {
            this.image13.setVisible(true);
            this.image14.setVisible(false);
          }
          
          if (this.image9Attached && this.image10Attached) {
            this.cleanImg.setVisible(true);
            this.dirtyImg.setVisible(false);
          }
        }
        // Diğer parçaların takılma kontrolü
        else if (item.key === 'image9') {
          this.image9Attached = true;
        } else if (item.key === 'image10') {
          this.image10Attached = true;
        }

        // Her iki parça da takıldıysa
        if (this.image9Attached && this.image10Attached) {
          this.smallImg2.setVisible(false);
          
          // Ortamın mevcut durumuna göre görüntüyü ayarla
          if (this.isEnvironmentClean) {
            this.cleanImg.setVisible(true);
            this.dirtyImg.setVisible(false);
          } else {
            this.cleanImg.setVisible(false);
            this.dirtyImg.setVisible(true);
          }
        }

        img.setVisible(false);
      } else {
        img.setAlpha(1);
        img.setPosition(
          this.inventorySlots[item.slot].x,
          inventoryY + (slotSize / 2)
        );
        img.setDisplaySize(slotSize, slotSize);
      }
    });

    img.on('pointerover', () => {
      img.setAlpha(0.5);
    });

    img.on('pointerout', () => {
      img.setAlpha(1);
    });

    return img;
  });

  // Ok simgesi
  const arrow = this.add.image(width / 2, height - 30, 'arrow')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(50, 50)
    .setInteractive();

  arrow.on('pointerdown', () => {
    this.inventoryOpen = !this.inventoryOpen;
    
    this.tweens.add({
      targets: this.inventorySlots,
      y: this.inventoryOpen ? inventoryY : inventoryY + inventoryHeight,
      duration: 300,
      ease: 'Power2',
      onUpdate: () => {
        this.inventorySlots.forEach((slot, index) => {
          slot.setY(this.inventoryOpen ? inventoryY + (slotSize / 2) : inventoryY + inventoryHeight + (slotSize / 2));
        });
      }
    });

    // Tüm envanter öğelerinin görünürlüğünü güncelle
    this.inventoryImages.forEach((img, index) => {
      if (this.inventoryOpen) {
        img.setPosition(
          this.inventorySlots[inventoryItems[index].slot].x,
          inventoryY + (slotSize / 2)
        );
        img.setVisible(true);
        img.setDisplaySize(slotSize, slotSize);
      } else {
        img.setVisible(false);
      }
    });
  });

  // Sol üst köşedeki resimler - başlangıçta gizli olacaklar
  this.image13 = this.add.image(20, 20, 'image13')
    .setDisplaySize(250, 250)
    .setOrigin(0, 0)
    .setDepth(1000)
    .setVisible(false);  // Başlangıçta gizli

  this.image14 = this.add.image(80, 20, 'image14')
    .setDisplaySize(250, 250)
    .setOrigin(0, 0)
    .setDepth(1000)
    .setVisible(false);  // Başlangıçta gizli

  // Resize olayını güncelle
  this.scale.on('resize', (gameSize) => {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);

    // Yeni ortak konum hesapla
    const newCommonX = width / 2;
    const newCommonY = height / 2 + 100;

    this.background.setPosition(width / 2, height / 2);
    resizeBackground(this.background, width, height);

    this.smallImg1.setPosition(width / 2, height / 2 + 50);
    
    // Tüm resimleri aynı konuma güncelle
    this.smallImg2.setPosition(newCommonX, newCommonY);
    this.cleanImg.setPosition(newCommonX, newCommonY);
    this.dirtyImg.setPosition(newCommonX, newCommonY);

    this.inventoryImages.forEach((img, index) => {
      img.setPosition(
        this.inventorySlots[inventoryItems[index].slot].x,
        inventoryY + (slotSize / 2)
      );
    });

    // StatusText'in konumunu güncelle
    this.statusText.setPosition(width - 20, 20);

    // Sol üst köşedeki resimlerin konumunu güncelle
    this.image13.setPosition(20, 20);
    this.image14.setPosition(80, 20);
  });
}

function resizeBackground(image, width, height) {
  const scaleX = width / image.width;
  const scaleY = height / image.height;
  const scale = Math.max(scaleX, scaleY);
  image.setScale(scale).setScrollFactor(0);
}
