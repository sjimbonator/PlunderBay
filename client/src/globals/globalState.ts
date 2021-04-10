import { Vector3 } from "@babylonjs/core";

export let currentPointerScenePostion: Vector3;
export function setCurrentPointerScenePostion(position: Vector3): void { currentPointerScenePostion = position; }

export let lerp: boolean = true;
export function setLerp(test: boolean): void {
    lerp = test;
    if (test) {
        document.getElementById("InterpolationText").innerHTML = "Interpolation is ON";
    } else {
        document.getElementById("InterpolationText").innerHTML = "Interpolation is OFF";
    }
}

document.querySelector('#offButton').addEventListener('click', () => setLerp(false));
document.querySelector('#onButton').addEventListener('click', () => setLerp(true));