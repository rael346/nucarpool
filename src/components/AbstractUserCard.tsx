import Rating from "@mui/material/Rating/Rating";
import dayjs from "dayjs";
import mapboxgl from "mapbox-gl";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ButtonInfo, PublicUser } from "../utils/types";

interface AbstractUserCardProps {
  userCardObj: PublicUser;
  isFavorited: boolean;
  handleFavorite: (add: boolean) => void;
  leftButton?: ButtonInfo;
  rightButton: ButtonInfo;
  inputProps?: {
    map: mapboxgl.Map;
    previousMarkers: mapboxgl.Marker[];
    clearMarkers: () => void;
  };
}

export const AbstractUserCard = (props: AbstractUserCardProps): JSX.Element => {
  /**
   * https://stackoverflow.com/questions/69687530/dynamically-build-classnames-in-tailwindcss
   * Because Tailwind does not support dynnamic CSS, the returns of the two functions below
   * need to be their complete full className in order to be rendered correctly, hence the lack
   * of abstraction. Perhaps there is a better way of doing this though.
   */
  const backgroundColorCSS = (seatAvail: number): string => {
    if (seatAvail === 1) {
      return " bg-busy-red";
    } else if (seatAvail === 2) {
      return " bg-okay-yellow";
    } else {
      return " bg-good-green";
    }
  };

  const borderLColorCSS = (seatAvail: number): string => {
    if (seatAvail === 1) {
      return " border-l-busy-red";
    } else if (seatAvail === 2) {
      return " border-l-okay-yellow";
    } else {
      return " border-l-good-green";
    }
  };

  dayjs.extend(utc);
  dayjs.extend(timezone);

  /** Creates a div with 7 boxes, each representing a day of the week.
   *  Background color is green if the user is working on that day.
   */
  const DaysWorkingDisplay = (daysWorking: string) => {
    const boxes: JSX.Element[] = [];
    for (let i = 0; i < daysWorking.length; i = i + 2) {
      let backgroundColor = "";
      if (daysWorking[i] == "1") {
        backgroundColor = " bg-good-green";
      }
      boxes.push(
        <div
          key={i}
          className={"w-6 h-6 border-l-0 border border-black" + backgroundColor}
        ></div>
      );
    }
    return <div className="flex border-l border-black h-min">{boxes}</div>;
  };

  // Creates MapBox markers showing user's start address and the start area of the other user.
  const onViewRouteClick = (userCardObj: PublicUser) => {
    if (props.inputProps) {
      if (props.inputProps.map !== undefined) {
        props.inputProps.clearMarkers();

        const startMarker = new mapboxgl.Marker({ color: "#2ae916" })
          .setLngLat([
            props.userCardObj.startPOICoordLng,
            userCardObj.startPOICoordLat,
          ])
          .addTo(props.inputProps.map);

        const endMarker = new mapboxgl.Marker({ color: "#f0220f" })
          .setLngLat([
            userCardObj.companyPOICoordLng,
            userCardObj.companyPOICoordLat,
          ])
          .addTo(props.inputProps.map);

        props.inputProps.previousMarkers.push(startMarker);
        props.inputProps.previousMarkers.push(endMarker);

        props.inputProps.map.fitBounds([
          [
            Math.min(
              userCardObj.startPOICoordLng,
              userCardObj.companyPOICoordLng
            ) - 0.125,
            Math.max(
              userCardObj.startPOICoordLat,
              userCardObj.companyPOICoordLat
            ) + 0.05,
          ],
          [
            Math.max(
              userCardObj.startPOICoordLng,
              userCardObj.companyPOICoordLng
            ) + 0.05,
            Math.min(
              userCardObj.startPOICoordLat,
              userCardObj.companyPOICoordLat
            ) - 0.05,
          ],
        ]);
      }
    }
  };

  const getButtonClassName = (
    withFill: boolean,
    button: ButtonInfo | undefined
  ): string => {
    if (withFill) {
      if (button == undefined || button.color == undefined) {
        return "bg-northeastern-red w-1/2 hover:bg-red-700 rounded-md p-1 my-1 text-center text-white";
      } else {
        return "bg-sky-900 w-1/2 hover:bg-sky-900 rounded-md p-1 my-1 text-center text-white";
      }
    } else {
      return "w-1/2 hover:bg-stone-200 rounded-md p-1 my-1 text-center border-black border";
    }
  };

  return (
    <div
      className={
        "bg-stone-100 text-left px-6 py-4 rounded-xl m-3.5 align-center flex flex-col border-l-[13px] gap-2 shadow-md" +
        borderLColorCSS(props.userCardObj.seatAvail)
      }
    >
      <div className="flex justify-between">
        {/* top row */}
        <div className="flex">
          <div className="text-lg">
            <p className="font-semibold">{props.userCardObj.name}</p>
            <p className="font-light">{props.userCardObj.companyName}</p>
          </div>
        </div>
        <Rating
          name=""
          size="large"
          onChange={(_, value) => props.handleFavorite(!!value)}
          value={props.isFavorited ? 1 : 0}
          max={1}
        />
      </div>
      {/* second row */}
      <p className="font-semibold">{props.userCardObj.startPOILocation}</p>
      {/* third row */}
      <div className="w-full flex gap-4 items-center">
        {DaysWorkingDisplay(props.userCardObj.daysWorking)}
        <div
          className={
            "w-7 h-7 flex justify-center items-center rounded-md font-semibold" +
            backgroundColorCSS(props.userCardObj.seatAvail)
          }
        >
          {props.userCardObj.seatAvail}
        </div>
      </div>
      {/* fourth row */}
      <div className="w-full m-0 flex justify-between align-middle">
        <div className="font-normal text-sm flex">
          <p className="pr-1">Start:</p>
          <p className="font-semibold">
            {dayjs.tz(props.userCardObj.startTime, "UTC").format("h:mm")} am
          </p>
          <p className="font-semibold px-2"> | </p>
          <p className="pr-1">End:</p>
          <p className="font-semibold">
            {dayjs.tz(props.userCardObj.endTime, "UTC").format("h:mm")} pm
          </p>
        </div>
      </div>
      {/* last row */}
      <div className="flex flex-row gap-2 justify-between">
        <button
          onClick={() =>
            props.leftButton
              ? props.leftButton.onPress(props.userCardObj)
              : onViewRouteClick(props.userCardObj)
          }
          className={getButtonClassName(false, props.leftButton)}
        >
          {props.leftButton ? props.leftButton.text : "View Route"}
        </button>
        <button
          onClick={() => props.rightButton.onPress(props.userCardObj)}
          className={getButtonClassName(true, props.rightButton)}
        >
          {props.rightButton.text}
        </button>
      </div>
    </div>
  );
};