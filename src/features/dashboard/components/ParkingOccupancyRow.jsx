export default function ParkingOccupancyRow({ p }) {
  const color = p.occupancy >= 90 ? 'var(--red)' : p.occupancy >= 75 ? 'var(--orange)' : 'var(--green)';
  
  return (
    <div className="parking-row">
      <div className="parking-row-name">
        <div className="name">{p.shortName}</div>
        <div className="address">{p.tag}</div>
      </div>
      <div className="parking-row-bar">
        <div className="progress">
          <div className="progress-bar" style={{
            width: p.occupancy + '%',
            background: color
          }} />
        </div>
      </div>
      <div className="parking-row-pct" style={{ color }}>{p.occupancy}%</div>
    </div>
  );
}
