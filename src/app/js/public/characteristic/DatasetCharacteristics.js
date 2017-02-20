import compose from 'recompose/compose';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { connect } from 'react-redux';
import { isLoggedIn } from '../../user';
import DatasetCharacteristicsEdition from './DatasetCharacteristicsEdition';
import DatasetCharacteristicsView from './DatasetCharacteristicsView';
import { fromCharacteristic } from '../../selectors';

const mapStateToProps = state => ({
    canEdit: isLoggedIn(state),
    editing: fromCharacteristic.isCharacteristicEditing(state),
});

export default compose(
    connect(mapStateToProps),
    branch(
        props => props.canEdit && props.editing,
        renderComponent(DatasetCharacteristicsEdition),
    ),
)(DatasetCharacteristicsView);