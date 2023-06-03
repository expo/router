import * as Device from "expo-device";
import { useEffect } from "react";
import { Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCheckbox,
  setupIonicReact,
} from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

// /* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding";
import "@ionic/react/css/float-elements";
import "@ionic/react/css/text-alignment";
import "@ionic/react/css/text-transformation";
import "@ionic/react/css/flex-utils";
import "@ionic/react/css/display";

setupIonicReact();

export default function Page() {
  useEffect(() => {
    Device.getDeviceTypeAsync().then((data) => console.log("device:" + data));
  }, []);

  // return (
  //   <IonPage>
  //     <IonHeader>
  //       <IonToolbar>
  //         <IonTitle>Tab 2</IonTitle>
  //       </IonToolbar>
  //     </IonHeader>
  //     <IonContent>
  //       <Text>Hello World</Text>
  //       <IonCheckbox></IonCheckbox>
  //     </IonContent>
  //   </IonPage>
  // );
  return (
    <div>
      <IonCheckbox indeterminate={true}>Indeterminate checkbox</IonCheckbox>
      <Text
        onPress={() => {
          // alert("start");
          // Device.getDeviceTypeAsync().then((data) =>
          //   console.log("device:" + data)
          // );
          ImagePicker.launchImageLibraryAsync().then((data) =>
            console.log("image:" + data)
          );
        }}
      >
        Hello Web World
      </Text>
      <TerminalIcon />
    </div>
  );
}

function TerminalIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" x2="20" y1="19" y2="19"></line>
    </svg>
  );
}

// TODO:
// import DomView from 'dom:https://github.com/'
// => export default (props) => <WebView source={{ uri: 'https://github.com/' }} {...props} />
