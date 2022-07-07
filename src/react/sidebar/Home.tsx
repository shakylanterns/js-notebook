import { useDisclosure } from "@chakra-ui/react";
import { Fragment } from "react";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { closeEditor, selectIsFileTouched } from "../../redux/reducers/cells";
import SaveBeforeClosingEditor from "../modals/SaveBeforeClosingEditor";
import SidebarIcon from "./SidebarIcon";

const Home = () => {
  const disclosure = useDisclosure();
  const touched = useAppSelector(selectIsFileTouched);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onHomeBtnClick = () => {
    if (touched) {
      disclosure.onOpen();
    } else {
      dispatch(closeEditor());
      navigate("/");
    }
  };

  return (
    <Fragment>
      <SaveBeforeClosingEditor disclosure={disclosure} />
      <SidebarIcon icon={FaHome} text="Home" onClick={onHomeBtnClick} />
    </Fragment>
  );
};

export default Home;
