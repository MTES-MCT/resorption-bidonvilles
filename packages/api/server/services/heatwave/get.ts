import heatwaveModel from '#server/models/heatwaveModel';
import ServiceError from '#server/errors/ServiceError';
import { Heatwave } from '#root/types/resources/Heatwave.d';

const isHeatwavePeriodActive = (heatwaveRecord: Heatwave[]): boolean => {
    const currentDate: Date = new Date();
    let ActiveHeatwavePeriod: boolean = false;
    if (currentDate >= new Date(heatwaveRecord[0].start_date) && currentDate <= new Date(heatwaveRecord[0].end_date)) {
        ActiveHeatwavePeriod = true;
    }
    return ActiveHeatwavePeriod;
};

export default async (): Promise<Heatwave> => {
    let heatwaveRecord: Heatwave[];
    try {
        heatwaveRecord = await heatwaveModel.get();
    } catch (error) {
        throw new ServiceError('heatwave_fetch_failed', error);
    }

    if (!heatwaveRecord || heatwaveRecord.length === 0) {
        throw new ServiceError('heatwave_not_found', 'Aucun paramètre de canicule trouvé en base de données' as any);
    } else {
        heatwaveRecord[0].isPeriodActive = isHeatwavePeriodActive(heatwaveRecord);
    }

    return heatwaveRecord[0];
};
