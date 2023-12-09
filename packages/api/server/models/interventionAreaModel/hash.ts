/* eslint-disable no-param-reassign */
import { RawInterventionArea } from '#server/models/userModel/_common/query.d';
import { Organization } from '#root/types/resources/Organization.d';
import serialize from './serialize';

export default (areas: RawInterventionArea[], organizations: { [id: number]: Organization }): void => {
    areas.forEach((area) => {
        if (!organizations[area.fk_organization]) {
            return;
        }

        if (area.type === 'nation') {
            organizations[area.fk_organization].intervention_areas.is_national = true;
        }

        organizations[area.fk_organization].intervention_areas.areas.push(serialize(area));
    });
};
