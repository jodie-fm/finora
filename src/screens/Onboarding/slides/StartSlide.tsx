import React from "react";
import Button from "../../../components/Button/Button";
import Label from "../../../components/Label/Label";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import { Style_Hero } from "../Onboarding.style";
import styled from "styled-components/native";
import { SlideProps } from "./Slides.type";

const Style_Image = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
  align-self: center;
  max-height: 250px;
  max-width: 250px;
`;

const StartSlide = ({ scrollToIndex }: SlideProps) => {
  return (
    <>
      <Style_Hero>
        <Style_Image source={require("../../../assets/splash-icon.png")} />
        <Label size="xl" weight="bold" align="center">
          Willkommen bei Glance
        </Label>
      </Style_Hero>
      <Button type="primary" onPress={() => scrollToIndex("overview")}>
        <Label color="background">Erste Schritte</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default StartSlide;
