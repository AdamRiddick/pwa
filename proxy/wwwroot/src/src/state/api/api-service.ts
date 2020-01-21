import { RSAA } from 'redux-api-middleware';

export class Api {
    private baseUrl: string | undefined = undefined;

    public setBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public delete = (actionType: string, endpoint: string): any => this.buildRsaa(actionType, endpoint, 'DELETE');

    public get = (actionType: string, endpoint: string): any => this.buildRsaa(actionType, endpoint, 'GET');

    public patch = (actionType: string, endpoint: string, payload: any) => this.buildRsaa(actionType, endpoint, 'PATCH', payload);

    public post = (actionType: string, endpoint: string, payload: any) => this.buildRsaa(actionType, endpoint, 'POST', payload);

    public postMultipart(actionType: string, endpoint: string, binary: any, data: any) {
        const payload = new FormData();
        payload.append('binary', binary);
        payload.append('data', JSON.stringify(data) || '');

        return this.buildRsaa(actionType, endpoint, 'POST', payload);
    }

    public put = (actionType: string, endpoint: string, payload: any) => this.buildRsaa(actionType, endpoint, 'PUT', payload);

    private buildEndpoint(endpoint: string) {
        return (this.baseUrl) ? `${this.baseUrl}${endpoint}` : endpoint;
    }

    private buildRsaa(actionType: string, endpoint: string, method: string, payload?: any): any {
        const fullEndpointUri = this.buildEndpoint(endpoint);

        return {
            [RSAA]: {
                body: payload ? JSON.stringify(payload) : null,
                credentials: 'same-origin',
                endpoint: fullEndpointUri,
                headers: payload ? { 'Content-Type': 'application/json' } : {},
                method: method,
                types: this.buildTypes(actionType),
            }
        }
    }

    private buildTypes(actionType: string) {
        return [
            {
                type: actionType + "_REQUEST",
                payload: function (action: any) {
                    return JSON.parse(action[RSAA].body);
                },
            },
            {
                type: `${actionType}_SUCCESS`, 
                meta: function (_: any, __: any, res: any) {
                    const location = res.headers.get('Location');
                    
                    if (location) {
                        return {
                            headers: {
                                location,
                            }
                        };
                    };

                    return null;
                },
            },
            `${actionType}_FAILURE`];
    }
}

export default new Api();
