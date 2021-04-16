import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';

export const GET_INVOICE = 'Invoice.GET_INVOICE';
export const GET_MEMBER_INVOICES = 'Invoice.GET_MEMBER_INVOICES';
export const GET_INVOICES_CLUB = 'Invoice.GET_INVOICES_CLUB';
export const CLEAR = 'Invoice.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getInvoices = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    //filter[club_id]=1&filter[id]=23&filter[confirmed]=1
    return fetch(`/features/zirkl-pay/invoice?filter[club_id]=${club_id}`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getInvoices:', res);
            if (res && res.data) {
                //showMessage('Successfully created.', true);
                await dispatch({
                    type: GET_INVOICES_CLUB,
                    invoices_club: res.data,
                });
                callback && callback(res.data);
            } else {
                callback && callback();
            }
        },
        failure: err => {
            callback && callback();
            console.log('====err', err);
            errorHTTP(err);
        },
    });
};
export const getMemberInvoices = (user_id, club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;

    return fetch(
        `/features/zirkl-pay/get-member-invoices?filter[user_id]=${user_id}&filter[club_id]=${club_id}`,
        {
            method: 'GET',
            contentType: 'application/json',
            token,
            success: async res => {
                console.log('getMemberInvoices:', res);
                if (res && res.data) {
                    //showMessage('Successfully created.', true);
                    await dispatch({
                        type: GET_MEMBER_INVOICES,
                        member_invoices: res.data,
                    });
                    callback && callback(res.data);
                } else {
                    callback && callback();
                }
            },
            failure: err => {
                callback && callback();
                console.log('====err', err);
                errorHTTP(err);
            },
        },
    );
};

export const createInitialInvoice = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch('/features/zirkl-pay/init-invoice', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            club_id,
        },
        success: async res => {
            console.log('createInitialInvoice:', res);
            if (res && res.data) {
                //showMessage('Successfully created.', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.data});
                callback && callback(res.data);
            } else {
                callback && callback();
            }
        },
        failure: err => {
            callback && callback();
            console.log('====err', err);
            errorHTTP(err);
        },
    });
};
export const changeAmountOfMembersFromPlan = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    console.log('/features/zirkl-pay/change-member-invoice-amount', body);
    return fetch('/features/zirkl-pay/change-member-invoice-amount', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            callback && callback(res);
            console.log('changeAmountOfMembersFromPlan:', res);
            if (res && res.data) {
                showMessage('Successfully changed.', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.data});
            }
        },
        failure: err => {
            callback && callback();
            console.log('==== changeAmountOfMembersFromPlanerr', err);
            errorHTTP(err);
        },
    });
};
export const updateInvoiceDetails = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    console.log('features/zirkl-pay/update-invoice', body);
    return fetch('/features/zirkl-pay/update-invoice', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            callback && callback(res);
            console.log('updateInvoiceDetails:', res);
            if (res && res.invoice) {
                showMessage('Invoice details updated', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.invoice});
                return;
            }

            if (res && res.message) {
                errorHTTP(res);
                return;
            }
        },
        failure: err => {
            callback && callback();
            console.log('==== updateInvoiceDetails', err);
            errorHTTP(err);
        },
    });
};
export const confirmInvoice = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    console.log('features/zirkl-pay/confirm-invoice', body);
    return fetch('/features/zirkl-pay/confirm-invoice', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            if (res && res.invoice) {
                callback && callback(res.invoice);
                showMessage('Invoice confirmed', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.invoice});
                return;
            }

            if (res && res.message) {
                errorHTTP(res);
                return;
            }
        },
        failure: err => {
            callback && callback();
            console.log('==== updateInvoiceDetails', err);
            errorHTTP(err);
        },
    });
};
export const deleteInvoice = (draft_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/features/zirkl-pay/delete-draft/${draft_id}`, {
        method: 'DELETE',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('deleteInvoice -> res', res);
            callback && callback(res?.deleted);
        },
        failure: err => {
            callback && callback(false);
            console.log('==== deleteInvoice', err);
            errorHTTP(err);
        },
    });
};

export const changePaymentStatusOfMember = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch('/features/zirkl-pay/change-member-payment-status', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            console.log('chnagePaymentStatusOfMember', res);
            if (res && res.data) {
                callback && callback(res.data);
                showMessage('changed payment status!', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.data});
                return;
            }

            if (res && res.message) {
                errorHTTP(res);
                return;
            }
        },
        failure: err => {
            console.log('chnagePaymentStatusOfMember: err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const updateFeeOption = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log(`updateFeeOption`, body);
    return fetch(`/features/zirkl-pay/update-zirklpay-fees-option`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            console.log('updateFeeOption', res);
            callback && callback(res);
            if (res && res.invoice) {
                showMessage('Invoice details updated', true);
                await dispatch({type: GET_INVOICE, cur_invoice: res.invoice});
                return;
            }

            if (res && res.message) {
                errorHTTP(res);
                return;
            }
        },
        failure: err => {
            console.log('updateFeeOption: err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};

export const setMembershipExclusion = (
    invoice_id,
    club_membership_plan_id,
    exclude,
    callback,
) => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    const url = '/features/zirkl-pay/exclude-club-membership-type';
    const body = {
        invoice_id,
        club_membership_plan_id,
        exclude: exclude ? 1 : 0,
        _method: 'POST',
    };
    console.log('🚀 ~ file: invoices.js ~ line 297 ~ body', body);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body,
        success: async res => {
            console.log('=====setMembershipExclusion', res);
            if (res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('🚀 ~ file: invoices.js ~ line 313 ~ err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};

export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    cur_invoice: null,
    invoices_club: [],
    member_invoices: [],
};

export default createReducer(initialState, {
    [GET_INVOICE]: (state, {cur_invoice}) => ({
        cur_invoice,
    }),
    [GET_INVOICES_CLUB]: (state, {invoices_club}) => ({
        invoices_club,
    }),
    [GET_MEMBER_INVOICES]: (state, {member_invoices}) => ({
        member_invoices,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
