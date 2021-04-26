import React, { Component } from 'react';
import './Wallet.css';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import { FACEBOOK_CHAT_POPUP_THEME_COLOR, FACEBOOK_APP_ID, FACEBOOK_PAGE_ID } from "../../common";
import {
    TButton,
    Page,
    withLoader,
    BankPopUp,
    ConfirmationPopup,
    DropDown
} from '../../components'

import { 
    getWalletInfo, 
    getBankInfo, 
    getStatusInfo, 
    getLogInfo, 
    deleteBankAccount ,
    getLogInfoFromSelect, 
    getBanks, 
    addBankAccount 
} from '../../services';

class Wallet extends Component {

    state = {
        wallet: "",
        bank: [],
        status: [],
        log: [],
        loading: false,
        banks: []
    }

    async componentDidMount(){
        this.setState({ loading: true });
        try{

            let res = await getWalletInfo();

            this.setState({
                wallet: res.data
            });

        } catch(e){
        }

        try{

            let res = await getBankInfo();

            
            this.setState({
                bank: res.data
            });

        }catch(e){
        }

        try{

            let res = await getStatusInfo();
            
            this.setState({
                status: res.data
            });

        }catch(e){
        }

        try{

            let res = await getLogInfo();
            
            this.setState({
                log: res.data
            });

        }catch(e){
        }

        try{

            let res = await getBanks();

            this.setState({
                banks: res.data
            });

        }catch(e){
        }

        await this.setState({ loading: false });
    }


    onChangeLog = e => {
        getLogInfoFromSelect(e.target.value)
        .then(res => {
            this.setState({
                log: res.data
            });
        })
    }


    addBankAccount = null;
    openPopUp = () => this.addBankAccount.toggle();
    ConfirmationPopup = null;
    openConfirmationPopUp = (item) => this.ConfirmationPopup.toggle(item);
  
    delbankAccount  =async (bankId) => {
        let body= {
            account_id:bankId
        }
        try {
           let res= await deleteBankAccount(body)
            window.location.reload();
        }
        catch (e) {
            this.props.init_notification({
                type: "error",
                title: this.props.locale.error,
                message: this.props.locale.error_message
            });
        }
      };

    render(){
        const { wallet, bank, status, log,  banks } = this.state;
        const{ locale }=this.props
        return (
            <Page 
            title={locale.wallet_title_head}
            description={locale.wallet_title_desc}
            {...this.props}>

                <div className="section">
                    <div className="container">
                    <div>
                    <MessengerCustomerChat
                        pageId={FACEBOOK_PAGE_ID}
                        greeting_dialog_display="hide"
                        appId={FACEBOOK_APP_ID}
                        themeColor={FACEBOOK_CHAT_POPUP_THEME_COLOR}
                        language={this.props.lang == "en" ? "en_US" : "ar_AR"}
                        greetingDialogDelay={0}
                        minimized={true}
                        shouldShowDialog={false}
                        loggedInGreeting={this.props.locale.facebook_chat_greeting_message}
                        loggedOutGreeting={this.props.locale.facebook_chat_greeting_message}
                        />
                    </div>
                        <h1 className="page-title mar-bot-40 is-uppercase">{locale.wallet_title_head}</h1>
                        <div className="columns is-multiline">
                            <div className="column is-4-desktop is-12-mobile is-12-tablet balance-column">
                                <div className="white-box stat">
                                    <div className="level is-mobile">
                                        <div className="level-left">
                                            <h4 className="balance-text">{locale.balance_head}<h3 className="balance-num">{wallet.balance == undefined ? 0 : wallet.balance} <span>{wallet.currency}</span></h3></h4>
                                        </div>
                                        <div className="level-right">
                                            {wallet.balance > 1000&&<TButton                                             
                                            ariaLabel="Transfer"
                                                text={locale. wallet_container.request_transfer_btn}
                                                className="green"
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-8-desktop is-12-mobile is-12-tablet wallet-info-column">
                                <div className="white-box stat" id="wallet-info">
                                    <div className="columns is-mobile is-multiline">
                                        <div className="column is-3-desktop is-6-mobile is-6-tablet">
                                            <h4>{locale. wallet_container.earnings}</h4>
                                            <h3>{parseFloat(wallet.total).toFixed(2) === 'NaN' ? 0 : parseFloat(wallet.total).toFixed(2)} <span>{wallet.currency}</span></h3>
                                        </div>
                                        <div className="column is-3-desktop is-6-mobile is-6-tablet">
                                            <h4>{locale. wallet_container.withdrawn}</h4>
                                            <h3>{parseFloat(wallet.withdrawn).toFixed(2) === 'NaN' ? 0 : parseFloat(wallet.withdrawn).toFixed(2)} <span>{wallet.currency}</span></h3>
                                        </div>
                                        <div className="column is-3-desktop is-6-mobile is-6-tablet">
                                            <h4>{locale. wallet_container.pending_clearance}</h4>
                                            <h3>{parseFloat(wallet.pending).toFixed(2) === 'NaN' ? 0 : parseFloat(wallet.pending).toFixed(2)} <span>{wallet.currency}</span></h3>
                                        </div>
                                        <div className="column is-3-desktop is-6-mobile is-6-tablet">
                                            <h4>{locale. wallet_container.purchases}</h4>
                                            <h3>{parseFloat(wallet.purchases).toFixed(2) === 'NaN' ? 0 : parseFloat(wallet.purchases).toFixed(2)} <span>{wallet.currency}</span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="columns is-multiline">
                            <div className="column is-4-desktop is-12-tablet bank-account-details-column">
                                
                                    <div className="bank-account-details">
                                        <h2 className="med mar-bot-15 mar-right-15">{locale.wallet_container.bank_account_head}</h2>
                                        {bank.length > 0 && bank.map(account => (
                                            <div className="bank-account-data" key={account.bank_id}>
                                                <h5>{account.bank_name} <span style={{color: account.status === "Pending" ? 'red' : ''}}>{account.status}</span></h5>
                                                <h5>{account.account_number}</h5>
                                                <h5>{account.account_name}</h5>
                                                {/* <a href="#" className="blue med mar-right-30">Edit</a> */}
                                                <a onClick={() => this.openConfirmationPopUp(account.bank_id)} className="red med">{locale.remove}</a>
                                            </div>
                                        ))}
                                    </div>
                                
                                <div className="add-bank-account">
                                    <div className="columns is-mobile">
                                        <div className="column is-6-desktop is-7-mobile is-4-tablet">
                                            <BankPopUp
                                                ref={a => (this.addBankAccount = a)}
                                                lang={this.props.lang}
                                                locale={locale}
                                                banks={banks}
                                                addBankAccount={addBankAccount}
                                            />
                                            <ConfirmationPopup
                                            ref={a => (this.ConfirmationPopup = a)}
                                            lang={this.props.lang}
                                            translation={this.props.locale}
                                            action={this.delbankAccount}
                                            />
                                            <TButton 
                                            ariaLabel="Add Bank Account"
                                                text={locale. wallet_container.add_bank_account_btn}
                                                className="grad-blue mar-top-15"
                                                onPress={this.openPopUp}
                                            />
                                        </div>
                                        <div className="column is-6-desktop is-5-mobile is-8-tablet"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-8-desktop is-12-tablet">
                                <div className="wallet-filters">
                                    <div className="columns is-mobile">
                                        <div className="column is-4-desktop is-6-mobile is-6-tablet wallet-filters-column">
                                            {status.length > 0 && (
                                                <DropDown 
                                                    ariaLabel="Select Log"
                                                    name="log"
                                                    defaultValue={locale. wallet_container.log_select_placeholder}
                                                    options={status}
                                                    onChange={this.onChangeLog}
                                                />
                                            )}
                                            
                                        </div>
                                        <div className="column is-3-desktop is-6-mobile is-6-tablet">
                                            {status.length > 0 && (
                                                <DropDown 
                                                ariaLabel="Select Date"
                                                    name="date"
                                                    defaultValue={locale. wallet_container.date_select_head}
                                                    options={[
                                                        {
                                                            value: 0,
                                                            title: locale. wallet_container.date_select_first
                                                        },
                                                        {
                                                            value: 1,
                                                            title: locale. wallet_container.date_select_second
                                                        },
                                                        {
                                                            value: 2,
                                                            title: locale. wallet_container.date_select_third
                                                        },
                                                        {
                                                            value: 3,
                                                            title: locale. wallet_container.date_select_fourth
                                                        }
                                                    ]}
                                                />
                                            )}
                                        </div>
                                        <div className="column is-6 is-hidden-touch"></div>
                                    </div>
                                    <div className="wallet-table-head is-hidden-touch">
                                        <div className="columns">
                                            <div className="column is-2">
                                                <h4>{locale.wallet_container.date_select_head} <img src={require('../../assets/images/sort-down.svg')} alt="sort down" /><img src={require('../../assets/images/sort-up.svg')} alt="sort up" /></h4>
                                            </div>
                                            <div className="column is-6">
                                                <h4>{locale.wallet_container.log_select_placeholder}</h4>
                                            </div>
                                            <div className="column is-2">
                                                <h4>{locale.wallet_container.table_head_amount}</h4>
                                            </div>
                                            <div className="column is-2">
                                                <h4>{locale.wallet_container.table_head_order_id}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {log.length > 0 && log.map((log, i) => (
                                        <div className="wallet-table" key={i}>
                                            <div className="columns is-mobile is-multiline">
                                                <div className="column is-2-desktop is-6-mobile is-6-tablet">
                                                    <h4 className="is-hidden-desktop">{locale.date_select_head}</h4>
                                                    <h3>{log.modified}</h3>
                                                </div>
                                                <div className="column is-6-desktop is-6-mobile is-6-tablet">
                                                    <h4 className="is-hidden-desktop">{locale.log_select_placeholder}</h4>
                                                    <p>{log.log}</p>
                                                </div>
                                                <div className="column is-2-desktop is-6-mobile is-6-tablet">
                                                    <h4 className="is-hidden-desktop">{locale.table_head_amount}</h4>
                                                    <h3>{parseFloat(log.amount).toFixed(2)} {log.currency}</h3>
                                                </div>
                                                <div className="column is-2-desktop is-6-mobile is-6-tablet">
                                                    <h4 className="is-hidden-desktop">{locale.table_head_order_id}</h4>
                                                    <a className="bluedark med" href="#">#{log.order_id}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}

export default withLoader(Wallet);