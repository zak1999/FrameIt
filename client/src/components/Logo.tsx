export default function Logo(): JSX.Element {
  return (
    <div className="logo">
      <img
        className="logoImg"
        src={process.env.PUBLIC_URL + '/assets/FRAMEIT_icon.png'}
        alt="img"
      ></img>
    </div>
  );
}
