import type {TComponentPreset} from "~/models/types/TComponentPreset";

export interface IComponentPresetService {
    getOptionsPresets(): Promise<TComponentPreset[]>;
    getOptionsPresetById(id: string): Promise<TComponentPreset>;
    createOptionsPreset(preset: TComponentPreset): Promise<TComponentPreset>;
    updateOptionsPreset(id: string, OptionsPreset: Partial<TComponentPreset>): Promise<TComponentPreset>;
    deleteOptionsPreset(id: string): Promise<void>;
}