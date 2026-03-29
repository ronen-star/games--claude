import React from "react";
import { Composition } from "remotion";
import { PalantirPresentation } from "./PalantirVideo";

const SLIDE_DURATION = 180; // 6s per slide at 30fps
const NUM_SLIDES = 8;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PalantirPresentation"
      component={PalantirPresentation}
      durationInFrames={SLIDE_DURATION * NUM_SLIDES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
