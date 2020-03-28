import React from 'react';
import { Button } from 'reactstrap';
import FormUtil from '../utils/form-util';
import { RequestInventoryContext } from '../contexts/RequestInventoryContext';

export default class NameCellRenderer extends React.Component {
    
    render() {
        
        let data = this.props.data;
        let value = '';

        if(data && data.user) {
            if(!FormUtil.isEmpty(data.user.first_name)) {
                value = data.user.first_name + ' ' + data.user.last_name;
            }
            else {
                value = data.user.org_name;
            }
        }
        if(FormUtil.isEmpty(value)) {
            return '';
        }
        return <RequestInventoryContext.Consumer>
            {ctx => (
                <Button size="sm" className="p-0" color="link text-secondary" onClick={ () => {
                        ctx.selectedSupplyRequest = this.props.data;
                        ctx.toggleSRDetailModal();
                    }
                }>{value}</Button>
                )
            }
            </RequestInventoryContext.Consumer>;
    }
}
