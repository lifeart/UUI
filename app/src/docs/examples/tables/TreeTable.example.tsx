import React, { useEffect, useMemo, useState } from 'react';
import { Location, svc } from '@epam/uui-docs';
import { DataSourceState, AsyncDataSource, DataColumnProps } from '@epam/uui';
import { Text, LinkButton, DataTable, DataTableMods, Panel } from '@epam/promo';
import * as css from './TablesExamples.scss';

export default function TreeTableExample({
    size
}: DataTableMods) {
    const [tableState, setTableState] = useState<DataSourceState>({
        sorting: [{ field: 'name', direction: 'asc' }],
    });

    const locationColumns: DataColumnProps<Location>[] = useMemo(() => [
        {
            key: 'name',
            caption: 'NAME',
            render: location => <Text size={ size }>{ location.name }</Text>,
            grow: 1, minWidth: 336,
            isSortable: true,
            fix: 'left',
        },
        {
            key: 'country',
            caption: 'COUNTRY',
            render: location => <Text size={ size }>{ location.countryName }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 164,
        },
        {
            key: 'type',
            caption: 'TYPE',
            render: location => (location.featureCode && <Text size={ size }>{ location.featureCode }</Text>),
            isSortable: true,
            grow: 0, shrink: 0, width: 84,
        },
        {
            key: 'lat/long',
            caption: 'LAT/LONG',
            render: location => location.lat && <LinkButton
                caption={ `${ location.lat }/${ location.lon }` }
                color='blue' size={ size }
                href={ `https://www.google.com/maps/search/?api=1&query=${ location.lat },${ location.lon }` }
                target='_blank'
            />,
            grow: 0, shrink: 0, width: 150,
            textAlign: 'center',
        },
        {
            key: 'population',
            caption: 'POPULATION',
            render: location => <Text size={ size }>{ location.population }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 130,
            textAlign: 'right',
        },
    ], []);

    const locationsDS = new AsyncDataSource<Location>({
        api: () => svc.api.demo.locations({}).then(r => r.items),
    });

    const handleTableStateChange = (newState: DataSourceState) => this.setState({ tableState: newState });

    useEffect(() => {
        return () => locationsDS.unsubscribeView(handleTableStateChange);
    }, []);

    // handleTableStateChange function should not be re-created on each render, as it would cause performance issues.
    const view = locationsDS.getView(tableState, handleTableStateChange, {
        getSearchFields: item => [item.name],
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'name': return item.name;
                case 'country': return item.countryName;
                case 'type': return item.featureCode;
                case 'population': return item.population;
            }
        },
        getRowOptions: item => ({
            checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
        }),
        cascadeSelection: true,
    });

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                getRows={ view.getVisibleRows }
                { ...view.getListProps() }
                value={ tableState }
                onValueChange={ setTableState }
                columns={ locationColumns }
                size={ size }
                headerTextCase='upper'
                border='none'
            />
        </Panel>
    );
}
