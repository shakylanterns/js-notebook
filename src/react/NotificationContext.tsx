import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  Slide,
} from "@chakra-ui/react";
import { createContext, Fragment, useContext, useReducer } from "react";

interface NotificationContextState {
  createNotification: (c: string, t: AlertProps["status"]) => void;
}

const NotificationContext = createContext<NotificationContextState>({
  createNotification: () => {
    return;
  },
});

export const useNotification = () => {
  return useContext(NotificationContext);
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface Notification {
  message: string;
  type: AlertProps["status"];
}

type Actions =
  | {
      type: "queue";
      payload: Notification;
    }
  | {
      type: "remove-front";
    };

const queueRedcuer = (state: Notification[], action: Actions) => {
  switch (action.type) {
    case "queue": {
      return [...state, action.payload];
    }
    case "remove-front": {
      const newState = [...state];
      newState.shift();
      return newState;
    }
    default:
      return state;
  }
};

const NotificationProvier: React.FC<Props> = ({ children }) => {
  const [queue, dispatch] = useReducer(queueRedcuer, []);

  const createNotification = (content: string, type: AlertProps["status"]) => {
    dispatch({
      type: "queue",
      payload: {
        message: content,
        type,
      },
    });
    setTimeout(() => {
      dispatch({
        type: "remove-front",
      });
    }, 5000);
  };

  const notificationBlock = queue.map(({ message, type }, index) => {
    return (
      <Slide
        direction="right"
        in={true}
        key={`not-${index}`}
        style={{ zIndex: -10 }}
      >
        <Alert
          status={type}
          position="fixed"
          right={8}
          bottom={8 + index * 16}
          maxWidth="50%"
        >
          <AlertIcon />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </Slide>
    );
  });

  return (
    <Fragment>
      {notificationBlock}
      <NotificationContext.Provider
        value={{
          createNotification,
        }}
      >
        {children}
      </NotificationContext.Provider>
    </Fragment>
  );
};

export default NotificationProvier;
