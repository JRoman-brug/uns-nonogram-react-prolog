import { useState } from "react";

function Modal({winCondition}) {
    const [finishAnimation, setFinishAnimation] = useState(false);
    const [openModal, setOpenModal] = useState("");

   function timing(){
    console.log("hola")
    setFinishAnimation(true)
   }
    return (
        <div className={`container_modal ${(!winCondition && finishAnimation)||(winCondition && !finishAnimation) ? "container_modal_open":""}`}>
            <div className={`modal_win ${winCondition?"modal_win_open":""}`} onAnimationEnd={timing}>
                <h1>WIN</h1>
            </div>
        </div>
    );
}

export default Modal;