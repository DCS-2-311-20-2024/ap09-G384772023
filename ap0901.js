//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G384772023 樋口蒼馬
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { GUI } from "ili-gui";


// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // 光源の作成
  //西
  const light1 = new THREE.DirectionalLight(0xffffff, 8);
  light1.position.set(-1, 10, 1);
  light1.castShadow = true;
  scene.add(light1);
//東
  const light2 = new THREE.DirectionalLight(0xffffff, 6);
  light2.position.set(1, 10, -1);
  light2.castShadow = true;
  scene.add(light2);
  /*
//北
  const light3 = new THREE.DirectionalLight(0xffffff, 4);
  light1.position.set(-1, 6, 8);
  light1.castShadow = true;
  scene.add(light3);
//南
  const light4 = new THREE.DirectionalLight(0xffffff, 4);
  light1.position.set(-1, 6, 8);
  light1.castShadow = true;
  scene.add(light4);
  */
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
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(housesize.flx,housesize.flz),new THREE.MeshLambertMaterial({color: 0xb08030}));
    floor.rotation.x =-Math.PI/2;
    floor.position.y = -1; //低くして座標を見やすくしてる
    floor.receiveShadow = true;
    house.add(floor);
    //壁
    const wallsize =new THREE.BoxGeometry(housesize.wlz,housesize.wly,housesize.flz);
    const wallcolor= new THREE.MeshLambertMaterial({color: 0xffffff});
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
    const dr =new THREE.BoxGeometry(drsize.drz,drsize.fmy,(drsize.fmx-drsize.fmz));
  }
  scene.add(door);
  //　カメラの更新
  orbitControls.update();
  // 描画処理

  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();