import React from 'react';
import { Button } from 'reactstrap';
import FormUtil from '../utils/form-util';
import { RequestInventoryContext } from '../contexts/RequestInventoryContext';

export default class NameCellRenderer extends React.Component {
    
    render() {
        
        let data = this.props.data;
        
        let value = '';
        let gridName = this.props.agGridReact.gridOptions.gridName;

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
                    if(gridName === 'supplyRequestGrid') {
                        ctx.selectedSupplyRequest = this.props.data;
                        ctx.toggleSRDetailModal();
                    } else {
                        ctx.selectedInventory = this.props.data;
                        ctx.toggleInventoryDetailModal();
                    }
                    }
                }>{value}</Button>
                )
            }
            </RequestInventoryContext.Consumer>;
    }
}
