import React from "react";
import Button from "../../../components/Button/Button";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import Label from "../../../components/Label/Label";
import MockTotalCard from "../MockTotalCard";
import { Style_Gap, Style_Hero } from "../Onboarding.style";
import { SlideProps } from "./Slides.type";

const OverviewSlide = ({ scrollToIndex }: SlideProps) => {
  return (
    <>
      <Style_Gap>
        <Label size="l" weight="bold" align="center">
          Deine Finanzen auf einen Blick
        </Label>
      </Style_Gap>
      <Style_Hero>
        <MockTotalCard />
      </Style_Hero>

      <Button type="primary" onPress={() => scrollToIndex("expenses")}>
        <Label color="background">Weiter</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default OverviewSlide;
