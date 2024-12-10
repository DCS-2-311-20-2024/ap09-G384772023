//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G384772023 樋口蒼馬
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from "three/addons";
import {GLTFLoader} from "three/addons";
import { GUI } from "ili-gui";


// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: false, // 座標軸
    tyuuya: false, //trueで夜falseで夜
    follow: false, //追跡
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");
  gui.add(param, "tyuuya").name("昼夜");
  gui.add(param, "follow").name("追跡");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // 光源の作成
  //西
  const light1 = new THREE.DirectionalLight(0xffffff, 4);
  light1.position.set(-1, 10, 1);
  light1.castShadow = true;
  scene.add(light1);
//東
  const light2 = new THREE.DirectionalLight(0xffffff, 3);
  light2.position.set(1, 10, -1);
  light2.castShadow = true;
  scene.add(light2);
  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,60,80);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.setClearColor(0xa9a9a9)
  document.getElementById("output").appendChild(renderer.domElement);

  //カメラ制御
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  //テクスチャ
  const textureLoader = new THREE.TextureLoader();
  //家の床と壁
  const housesize = {
    flx: 80, // 床の横の長さ
    flz: 60, // 床の縦の長さ
    wly: 20, // 壁の高さ
    wlz: 0.1  //壁の厚さ
  };
  const house = new THREE.Group();
  {
    //床
    const floorcolor= new THREE.MeshLambertMaterial();
    //床テクスチャ
    const texturefloor = textureLoader.load("flooring_0163_i.jpg.webp");
    floorcolor.map=texturefloor;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(housesize.flx,housesize.flz),floorcolor);
    floor.rotation.x =-Math.PI/2;
    floor.position.y = -1; //低くして座標を見やすくしてる
    floor.receiveShadow = true;
    house.add(floor);
    //壁
    const wallsize =new THREE.BoxGeometry(housesize.wlz,housesize.wly,housesize.flz);
    const wallcolor= new THREE.MeshLambertMaterial();
    //壁テクスチャ
    const texturewall = textureLoader.load("08eb71b43226a754c1ade4dfa71050f1_t.jpeg");
    wallcolor.map=texturewall;
    //右壁
    const rightwall = new THREE.Mesh(wallsize,wallcolor);
    rightwall.position.x =housesize.flx/2 ;
    rightwall.position.y =housesize.wly/2-1;
    rightwall.receiveShadow = true;
    house.add(rightwall);
    //左壁
    const leftwall = new THREE.Mesh(wallsize,wallcolor);
    leftwall.position.x =-housesize.flx/2 ;
    leftwall.position.y =housesize.wly/2-1;
    leftwall.receiveShadow = true;
    house.add(leftwall);
    //奥壁
    const frontwall = new THREE.Mesh(new THREE.BoxGeometry(housesize.flx,housesize.wly,housesize.wlz),wallcolor);
    frontwall.position.z =-housesize.flz/2 ;
    frontwall.position.y =housesize.wly/2-1;
    frontwall.receiveShadow = true;
    house.add(frontwall);
  }
  scene.add(house);
  //扉
  const drsize = {
    fmx: housesize.flz/4+3, // ドアフレームの横
    fmy: 15, // ドアフレームの高さ
    fmz: 0.5,  //　ドアフレームの厚さ
    drz: 0.25   //ドアの厚さ
  }
  const door = new THREE.Group();
  {
    //フレーム
    const framecolor = new THREE.MeshLambertMaterial({color: 0xb08030});
    const framever = new THREE.BoxGeometry(drsize.fmz,drsize.fmy,drsize.fmz);
    const framebe = new THREE.BoxGeometry(drsize.fmz,drsize.fmz,drsize.fmx);
    const leftframe= new THREE.Mesh(framever,framecolor);
    leftframe.position.set((-housesize.flx/2+drsize.fmz/2),(drsize.fmy/2-1),(housesize.flz/2-3));
    door.add(leftframe);
    const rightframe= new THREE.Mesh(framever,framecolor);
    rightframe.position.set((-housesize.flx/2+drsize.fmz/2),(drsize.fmy/2-1),(housesize.flz/2-3-(drsize.fmx-drsize.fmz)));
    door.add(rightframe);
    const overframe = new THREE.Mesh(framebe,framecolor);
    overframe.position.set((-housesize.flx/2+drsize.fmz/2),(drsize.fmy+drsize.fmz/2-1),(housesize.flz/2-3-(drsize.fmx/2-drsize.fmz/2)));
    door.add(overframe);
  //ドア
    const drmen =new THREE.BoxGeometry(drsize.drz,drsize.fmy,(drsize.fmx));
    const drcoler= new THREE.MeshLambertMaterial();
    //ドアテクスチャ
    const texturedoor = textureLoader.load("4c0a87929660f8a0ff5dafc5db652d50_t.jpeg");
    drcoler.map=texturedoor;
    const dr =new THREE.Mesh(drmen,drcoler);
    dr.position.set((-housesize.flx/2+drsize.drz/2),(drsize.fmy/2-1),(housesize.flz/2-drsize.fmx/2-3));
    door.add(dr);
  }
  scene.add(door);
  //窓
  const mdsize = {
    mfmx: 7.5, // 窓フレームの横
    mfmy: 9, // 窓フレームの高さ
    mfmz: 0.5,  //　窓フレームの厚さ
    mdz: 0.005   //窓の厚さ
  }
  const mado= new THREE.Group();
  {
    //窓フレーム
    const mdfmcolor = new THREE.MeshLambertMaterial({color: 0xb08030});
    const mdfmver =new THREE.BoxGeometry(mdsize.mfmz,mdsize.mfmy,mdsize.mfmz);
    const mdfmbe =new THREE.BoxGeometry(mdsize.mfmx,mdsize.mfmz,mdsize.mfmz);
    const mdfleft =new THREE.Mesh(mdfmver,mdfmcolor);
    mdfleft.position.set(-housesize.flx/2+5,housesize.wly/2,-housesize.flz/2+mdsize.mfmz/2);
    mado.add(mdfleft);
    const mdfright =new THREE.Mesh(mdfmver,mdfmcolor);
    mdfright.position.set(-housesize.flx/2+5+(mdsize.mfmx-mdsize.mfmz),housesize.wly/2,-housesize.flz/2+mdsize.mfmz/2);
    mado.add(mdfright);
    const mdfover =new THREE.Mesh(mdfmbe,mdfmcolor);
    mdfover.position.set(-housesize.flx/2+5+(mdsize.mfmx/2-mdsize.mfmz/2),housesize.wly/2+mdsize.mfmy/2,-housesize.flz/2+mdsize.mfmz/2);
    mado.add(mdfover);
    const mdfdown =new THREE.Mesh(mdfmbe,mdfmcolor);
    mdfdown.position.set(-housesize.flx/2+5+(mdsize.mfmx/2-mdsize.mfmz/2),housesize.wly/2-mdsize.mfmy/2,-housesize.flz/2+mdsize.mfmz/2);
    mado.add(mdfdown);
  }
    //窓
    const mdcolor = new THREE.MeshLambertMaterial();
    const texturehiru = textureLoader.load("mado-illust18.png");
    mdcolor.map=texturehiru;
    const textureyoru = textureLoader.load("3c3c3e57466acb77153884c793f43313_t.jpeg");
    const mdmen = new THREE.BoxGeometry(mdsize.mfmx-mdsize.mfmz,mdsize.mfmy-mdsize.mfmz,mdsize.mdz);
    const md =new THREE.Mesh(mdmen,mdcolor);
    md.position.set(-housesize.flx/2+5+(mdsize.mfmx/2),housesize.wly/2,-housesize.flz/2+housesize.wlz);
    scene.add(md);
  scene.add(mado);
  //テーブル
  const tblsize = {
    tenx: 20, // 天板の横
    teny: 15, // 天板の縦
    tenz: 0.5,  //　天板の厚さ
    asihen: 1 ,  //足の一辺
    asih:  7  //足の高さ
  }
  const table= new THREE.Group();
  {
    const tablecolor = new THREE.MeshLambertMaterial({color: 0xb08030});
    const tblasisize =new THREE.BoxGeometry(tblsize.asihen,tblsize.asih,tblsize.asihen);
    const tblten= new THREE.BoxGeometry(tblsize.tenx,tblsize.tenz,tblsize.teny);
    const tbltenban= new THREE.Mesh(tblten,tablecolor);
    const tblasileft1 = new THREE.Mesh(tblasisize,tablecolor);
    const tblasileft2 = new THREE.Mesh(tblasisize,tablecolor);
    const tblasiright1 = new THREE.Mesh(tblasisize,tablecolor);
    const tblasiright2 = new THREE.Mesh(tblasisize,tablecolor);
    //天板
    tbltenban.position.set(housesize.flx/4,tblsize.asih-1+tblsize.tenz/2,0);
    table.add(tbltenban);
    //足
    tblasileft1.position.set(housesize.flx/4-tblsize.tenx/2+tblsize.asihen/2,tblsize.asih/2-1,-tblsize.teny/2+tblsize.asihen/2);
    table.add(tblasileft1);
    tblasileft2.position.set(housesize.flx/4-tblsize.tenx/2+tblsize.asihen/2,tblsize.asih/2-1,tblsize.teny/2-tblsize.asihen/2);
    table.add(tblasileft2);
    tblasiright1.position.set(housesize.flx/4+tblsize.tenx/2-tblsize.asihen/2,tblsize.asih/2-1,-tblsize.teny/2+tblsize.asihen/2);
    table.add(tblasiright1);
    tblasiright2.position.set(housesize.flx/4+tblsize.tenx/2-tblsize.asihen/2,tblsize.asih/2-1,tblsize.teny/2-tblsize.asihen/2);
    table.add(tblasiright2);
  }
  scene.add(table);
  //椅子
  const isusize = {
    isubey: 5, // 下板の縦
    isubez: 0.5,  //　下板の厚さ
    isuverx: 5 ,  //板の横
    isuvery:  5.5 , //上板の縦
    isuverz: 0.5 , //上板の厚さ
    isuleg: 0.75 , //椅子の足の辺
    isulegh: 3  //椅子の足の高さ
  }
  //形
  const isu =new THREE.Group();
  {
    const charcolor = new THREE.MeshLambertMaterial({color: 0xb08030});
    const charlegleft1 =new THREE.Mesh(new THREE.BoxGeometry(isusize.isuleg,isusize.isulegh,isusize.isuleg),charcolor);
    const charlegleft2 =new THREE.Mesh(new THREE.BoxGeometry(isusize.isuleg,isusize.isulegh,isusize.isuleg),charcolor);
    const charlegright1 =new THREE.Mesh(new THREE.BoxGeometry(isusize.isuleg,isusize.isulegh,isusize.isuleg),charcolor);
    const charlegright2 =new THREE.Mesh(new THREE.BoxGeometry(isusize.isuleg,isusize.isulegh,isusize.isuleg),charcolor);
    const charver = new THREE.Mesh(new THREE.BoxGeometry(isusize.isuverz,isusize.isuvery,isusize.isuverx),charcolor);
    const charbe =new THREE.Mesh(new THREE.BoxGeometry(isusize.isubey,isusize.isuverz,isusize.isuverx),charcolor);
    charbe.position.y=(isusize.isulegh+isusize.isubez/2);
    isu.add(charbe);
    charver.position.set(-(isusize.isubey/2),(isusize.isulegh+isusize.isubez+isusize.isuvery/2),0);
    isu.add(charver);
    charlegleft1.position.set(isusize.isuverx/4,isusize.isulegh/2,isusize.isuverx/4);
    isu.add(charlegleft1);
    charlegleft2.position.set(-isusize.isuverx/4,isusize.isulegh/2,isusize.isuverx/4);
    isu.add(charlegleft2);
    charlegright1.position.set(isusize.isuverx/4,isusize.isulegh/2,-isusize.isuverx/4);
    isu.add(charlegright1);
    charlegright2.position.set(-isusize.isuverx/4,isusize.isulegh/2,-isusize.isuverx/4);
    isu.add(charlegright2);
  }
  const chars= new THREE.Group();
  {
  const isu1 = isu.clone();
  const isu2 = isu.clone();
  isu.position.set(housesize.flx/4-tblsize.tenx/2-3,-1,0);
  chars.add(isu);
  isu1.rotation.y=Math.PI;
  isu1.position.set(housesize.flx/4+tblsize.tenx/2+3,-1,0);
  isu2.rotation.y=Math.PI / 2;
  isu2.position.set(housesize.flx/4,-1,tblsize.teny/2+3)
  chars.add(isu2);
  chars.add(isu1);
  }
  scene.add(chars);

  // ディスプレイ
  const dpy = {
    W:8.5, // ディスプレイの幅
    H: 5.6, // ディスプレイの高さ
    D: 0.2, // ディスプレイの厚さ
    E: 0.1, // ディスプレイの縁
  }
  const std = {
    H: 3.0, // ディスプレイスタンドの高さ
    W: 2.5, // ディスプレイスタンドの幅
    D: 1.9, // ディスプレイスタンドの奥行
    T: 0.1, // ディスプレイスタンドの厚さ
  }
  const display = new THREE.Group();
  {
    // 表示部
    const silverMaterial = new THREE.MeshPhongMaterial({color: "silver"});
    const blackMaterial = new THREE.MeshPhongMaterial({color: "black"});
    const face = new THREE.Mesh(
      new THREE.BoxGeometry(dpy.W, dpy.H, dpy.D),
      [silverMaterial,silverMaterial,silverMaterial,
       silverMaterial,blackMaterial,silverMaterial ]
    );
    display.add(face);
    // スタンド台
    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(std.W, std.T, std.D),
      silverMaterial
    )
    standBase.position.y =-(dpy.H/4+std.H);
    display.add(standBase);    
    // スタンド脚
    const theta = Math.PI/8;
    const standBack = new THREE.Mesh(
      new THREE.BoxGeometry(
        std.W,
        std.H/Math.cos(theta) ,
        std.T ),
      silverMaterial
      )
      standBack.rotation.x = theta;
      standBack.position.set(
        0,
        -(dpy.H/4 + std.H/2) ,
        -(std.H * Math.tan(theta))/2 );
      display.add(standBack);
  }
  //テレビ台
  const teresize = {
    daibex : 10, //テレビ台の横板の横
    daibey : 4, //テレビ台の横板の縦
    daibez : 0.1, //テレビ台の横板の厚さ
    daiverx :0.3, //テレビ台の縦板の厚さ
    daivery :5, //テレビ台の縦板の高さ
  }
  const teredai = new THREE.Group();
  {
    const daicolor= new THREE.MeshLambertMaterial({color: 0xb08030});
    const daibemen =new THREE.BoxGeometry(teresize.daibex,teresize.daibez,teresize.daibey);
    const daivermen =new THREE.BoxGeometry(teresize.daiverx,teresize.daivery,teresize.daibey);
    const daiverleft =new THREE.Mesh(daivermen,daicolor);
    const daiverright =new THREE.Mesh(daivermen,daicolor);
    daiverleft.position.set(-teresize.daibex/2,teresize.daivery/2,0);
    daiverright.position.set(teresize.daibex/2,teresize.daivery/2,0);
    teredai.add(daiverleft);
    teredai.add(daiverright);
    const daibe1 = new THREE.Mesh(daibemen,daicolor);
    const daibe2 = new THREE.Mesh(daibemen,daicolor);
    const daibe3 = new THREE.Mesh(daibemen,daicolor);
    daibe1.position.y=0.5;
    daibe2.position.y=teresize.daivery/2;
    daibe3.position.y=teresize.daivery-teresize.daibez/2;
    teredai.add(daibe1);
    teredai.add(daibe2);
    teredai.add(daibe3);
  }
  display.position.set(housesize.flx/2-teresize.daibex/2-3,8.5,-housesize.flz/2+teresize.daibey/2);
  scene.add(display);
  teredai.position.set(housesize.flx/2-teresize.daibex/2-3,-1,-housesize.flz/2+teresize.daibey/2);
  scene.add(teredai);

  // モデルの読み込み
  let xwing; // モデルを格納する変数
  function loadModel() { // モデル読み込み関数の定義
    const loader = new GLTFLoader();
    loader.load(
      "xwing.glb",//モデルのファイル
      (gltf) => {
        xwing = gltf.scene;
        scene.add(xwing);
        render(); // 描画開始
      }
    );
  }
  loadModel(); // モデル読み込み実行
  // 自動操縦コースの設定
  // 制御点
  const controlPoints = [
    [0, 0, 0],
    [-housesize.flx/4,4,-housesize.flz/2+10],
    [-housesize.flx/2+6,10,0],
    [-housesize.flx/4,16,housesize.flz/2],
    [0,19,0],
    [housesize.flx/4,16,-housesize.flz/2+10],
    [housesize.flx/2-6,10,0],
    [housesize.flx/4,4,housesize.flz/2]
  ]
  // コースの補間
  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course = new THREE.CatmullRomCurve3(
    controlPoints.map((p, i) => {
      p0.set(...p);
      p1.set(...controlPoints[(i + 1) % controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0, p1, 1/3),
        (new THREE.Vector3()).lerpVectors(p0, p1, 2/3),
      ];
    }).flat(),true
  );
  
  //　カメラの更新
  orbitControls.update();
  // 描画処理
  //描画の変数
  const clock = new THREE.Clock();
  const xwingPosition = new THREE.Vector3();
  const xwingTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();
  // 描画関数
  function render() {
    // xwing の位置と向きの設定
    const elapsedTime = clock.getElapsedTime() / 30;
    course.getPointAt(elapsedTime % 1, xwingPosition);
    xwing.position.copy(xwingPosition);
    course.getPointAt((elapsedTime+0.01)%1, xwingTarget);
    xwing.lookAt(xwingTarget);
    // 座標軸の表示
    axes.visible = param.axes;
    //
    if(param.tyuuya) {
      mdcolor.map=textureyoru;
      renderer.setClearColor(0x2f4f4f);
    }else{
      mdcolor.map=texturehiru;
      renderer.setClearColor(0xe0ffff);
    }
    // カメラの位置の切り替え
    if(param.follow) {
      //xwingの後方から
      cameraPosition.lerpVectors(xwingTarget,xwingPosition, 4);
      cameraPosition.y += 2.5;
      camera.position.copy(cameraPosition);
      camera.lookAt(xwing.position);
      camera.up.set(0,1,0);
    }else{
      camera.position.set(0,60,80);

    }
    
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();