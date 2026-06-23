function Loader({
    text = "Loading...",
    fullScreen = false
}) {
    return (
        <div
            className={
                fullScreen
                    ? "min-h-screen flex flex-col items-center justify-center gap-3"
                    : "flex flex-col items-center justify-center py-20 gap-3"
            }
        >
            <span className="loading loading-spinner loading-lg text-primary"></span>

            <p className="text-sm text-base-content/60">
                {text}
            </p>
        </div>
    );
}

export default Loader;