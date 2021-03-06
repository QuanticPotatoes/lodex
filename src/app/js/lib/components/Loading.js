import React, { PropTypes } from 'react';
import { CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import Card from './Card';

const styles = {
    container: {
        paddingTop: '0.5rem',
    },
    textContainer: {
        display: 'flex',
    },
    progress: {
        marginRight: '1rem',
        marginTop: '-0.2rem',
    },
};

const Loading = ({ children }) => (
    <Card className="loading" style={styles.container}>
        <CardText style={styles.textContainer}>
            <CircularProgress style={styles.progress} size={20} />
            {children}
        </CardText>
    </Card>
);

Loading.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Loading;
