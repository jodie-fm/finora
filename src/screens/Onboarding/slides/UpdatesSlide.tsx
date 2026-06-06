import React from "react";
import { Keys, SlideProps } from "./Slides.type";
import MockUpdates from "../MockUpdates";
import { Style_Gap, Style_Hero } from "../Onboarding.style";
import Label from "../../../components/Label/Label";
import Button from "../../../components/Button/Button";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";

type UpdatesSlideProps = SlideProps & {
  activeKey: Keys;
};

const UpdatesSlide = ({ scrollToIndex, activeKey }: UpdatesSlideProps) => {
  return (
    <>
      <Style_Gap>
        <Label size="l" weight="bold" align="center">
          Echtzeit-Updates
        </Label>
        <Label size="s" color="textSecondary" align="center">
          Alle deine Daten werden in Echtzeit aktualisiert, damit du immer den
          Überblick behältst.
        </Label>
      </Style_Gap>
      <Style_Hero>
        <MockUpdates index="realtime-updates" activeKey={activeKey} />
      </Style_Hero>
      <Button type="primary" onPress={() => scrollToIndex("setup")}>
        <Label color="background">Weiter</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default UpdatesSlide;
