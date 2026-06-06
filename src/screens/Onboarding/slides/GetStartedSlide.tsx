import React, { memo, useCallback } from "react";
import { Style_Hero } from "../Onboarding.style";
import Label from "../../../components/Label/Label";
import Button from "../../../components/Button/Button";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import { useMMKVBoolean } from "react-native-mmkv";

const GetStartedSlide = () => {
  const [, setHasSeenOnboarding] = useMMKVBoolean("hasSeenOnboarding");

  const onGetStartedPress = useCallback(() => {
    setHasSeenOnboarding(true);
  }, [setHasSeenOnboarding]);

  return (
    <>
      <Style_Hero>
        <Label size="xl" weight="bold" align="center">
          Lass uns loslegen!
        </Label>
        <Label size="s" color="textSecondary" align="center">
          Du bist nun bereit, deine Finanzen im Blick zu behalten!
          {"\n"}
          Füge deine Ausgaben hinzu und beobachte deine Fortschritte!
        </Label>
      </Style_Hero>
      <Button type="primary" onPress={onGetStartedPress}>
        <Label color="background">Los geht's</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default memo(GetStartedSlide);
