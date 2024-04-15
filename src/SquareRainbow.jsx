function SquareRainbow({color,onClick}){
    if(!color) color = "red"
    const styleDiv = {
        width:"50px",
        height:"50px",
        borderRadius:"8px",
        display:"flex",
    }
    
    const styleButton = {
        width:"100%",
        height:"100%",
        border:"none",
        borderRadius:"8px",
        background:color,
        transition:".2s"
    }
    return (
        <div style={styleDiv}>
            <button style={styleButton} onClick={onClick}></button>
        </div>
    );
}

export default SquareRainbow;