import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import Pagination from './components/Pagination';

const styles = {
    container: {
        width: '100%',
    },
};

export default fetchProps => Component =>
    class extends React.Component {
        state = {
            isLoading: true,
            data: null,
            page: 0,
            perPage: 10,
        };

        componentDidMount() {
            this.fetchData();
        }

        componentWillReceiveProps() {
            this.fetchData();
        }

        fetchData() {
            const { page, perPage } = this.state;
            const props = this.props;
            this.setState({
                ...this.state,
                isLoading: true,
            }, () => fetchProps({ props, page, perPage })
                .then(data => this.setState({
                    data,
                    isLoading: false,
                }))
                .catch(error => this.setState({
                    error: error.message,
                    isLoading: false,
                })),
            );
        }

        onPaginationChange = (page, perPage) => {
            this.setState({
                ...this.state,
                page,
                perPage,
            }, () => this.fetchData());
        }

        render() {
            const { isLoading, data, error, page, perPage } = this.state;

            return (
                <div style={styles.container}>
                    {
                        isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Component
                                {...this.props}
                                data={data}
                                error={error}
                            />
                        )
                    }
                    {data && <Pagination
                        onChange={this.onPaginationChange}
                        currentPage={page}
                        perPage={perPage}
                        total={data.total}
                    />}
                </div>
            );
        }
    };
