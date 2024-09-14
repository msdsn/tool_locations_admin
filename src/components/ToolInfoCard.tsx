const ToolInfoCard = ({ patient }: any) => {
    const date = new Date(patient.location.timestamp);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',  // Day of the week
        year: 'numeric',  // Full year
        month: 'short',    // Month as full name
        day: 'numeric',   // Day of the month
        hour: '2-digit',  // Hour in two digits
        minute: '2-digit', // Minute in two digits
        second: '2-digit', // Second in two digits
        hour12: true,     // Use 12-hour format
        timeZoneName: 'short' // Time zone in short format
    }).format(date);

    // Inline styles
    const styles = {
        card: {
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: '24px',
            maxWidth: '400px',
        },
        details: {
            marginBottom: '16px',
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: '600',
        },
        label: {
            fontSize: '1.125rem',
            color: '#1e293b',
        },
        info: {
            fontSize: '0.875rem',
            color: '#6b7280',
            paddingLeft: '16px',
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.details}>
                <h3 style={styles.title}>Personal Details</h3>
                <p style={styles.label}>Name:</p>
                <p style={styles.info}>{patient.name}</p>
                <p style={styles.label}>Last Seen:</p>
                <p style={styles.info}>{formattedDate}</p>
            </div>
        </div>
    );
};

export default ToolInfoCard;