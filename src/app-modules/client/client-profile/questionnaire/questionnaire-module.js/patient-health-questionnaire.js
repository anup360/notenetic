import React, { useEffect } from "react";
import HealthQuestionnaire from "./questionnaire-pages/health-questionnaire-module";
import {
  GAD,
  Connor,
  PHQ,
  PrimeScreenQuestionName,
  ACE,
  CATS,
  RecentValues,
  Interference,
  MoodDisorder,
} from "./question-list/questionList";
import Header from "./header";
import GeneralAnxietyDisorder from "./questionnaire-pages/general-anxity-disorder";
import ConnorAbbreviatedRatingScale from "./questionnaire-pages/connor-abbreviated-rating-scale";
import MoodDisorderQuestionnaire from "./questionnaire-pages/mood-disorder";
import PrimeScreen from "./questionnaire-pages/prime-screen";
import Default from "./questionnaire-pages/default";
import AdverseChildhood from "./questionnaire-pages/Adverse-childhood-experience";
import ChildAdolesent from "./questionnaire-pages/child-adolescent-trauma";

const MyComponent = ({ componentType, questionId, questionListById }) => {


  let componentToRender;

  // Use switch case to determine which component to render
  switch (componentType) {
    case "10":
      componentToRender = (
        <GeneralAnxietyDisorder
          list={GAD}
          questionId={questionId}
          response={questionListById}
        />
      );
      break;
    case "11":
      componentToRender = (
        <ConnorAbbreviatedRatingScale
          list={Connor}
          questionId={questionId}
          response={questionListById}
        />
      );
      break;
    case "12":
      componentToRender = (
        <ChildAdolesent
          list={CATS}
          questionId={questionId}
          subList={RecentValues}
          interfered={Interference}
          response={questionListById}
        />
      );
      break;
    case "13":
      componentToRender = (
        <MoodDisorderQuestionnaire
          questionId={questionId}
          list={MoodDisorder}
          response={questionListById}
        />
      );
      break;
    case "14":
      componentToRender = (
        <PrimeScreen
          list={PrimeScreenQuestionName}
          questionId={questionId}
          response={questionListById}
        />
      );
      break;
    case "15":
      componentToRender = (
        <HealthQuestionnaire
          list={PHQ}
          questionId={questionId}
          response={questionListById}
        />
      );
      break;
    case "16":
      componentToRender = (
        <AdverseChildhood
          list={ACE}
          questionId={questionId}
          response={questionListById}
        />
      );
      break;
    default:
      // Render a default component or show an error message
      componentToRender = <Default />;
  }

  return (
    <div>
      {/* <Header /> */}
      {componentToRender}
    </div>
  );
};

export default MyComponent;
