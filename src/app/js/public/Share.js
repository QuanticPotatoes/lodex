import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';

import {
    ShareButtons,
    generateShareIcon,
} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    VKShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const VKIcon = generateShareIcon('vk');

const styles = {
    container: {
        display: 'flex',
    },
    icon: {
        cursor: 'pointer',
        margin: '0px 6px 0px 18px',
    },
};

export const ShareComponent = ({ uri, title }) => (
    <div className="share" style={styles.container}>
        <FacebookShareButton className="share-facebook" url={uri} title={title} style={styles.icon}>
            <FacebookIcon size={32} round />
        </FacebookShareButton>
        <GooglePlusShareButton className="share-google" url={uri} title={title} style={styles.icon}>
            <GooglePlusIcon size={32} round />
        </GooglePlusShareButton>
        <LinkedinShareButton className="share-linkedin" url={uri} title={title} style={styles.icon}>
            <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TwitterShareButton className="share-twitter" url={uri} title={title} style={styles.icon}>
            <TwitterIcon size={32} round />
        </TwitterShareButton>
        <TelegramShareButton className="share-telegram" url={uri} title={title} style={styles.icon}>
            <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton className="share-whatsapp" url={uri} title={title} style={styles.icon}>
            <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <VKShareButton className="share-vk" url={uri} title={title} style={styles.icon}>
            <VKIcon size={32} round />
        </VKShareButton>
    </div>
);

ShareComponent.propTypes = {
    uri: PropTypes.string.isRequired,
    title: PropTypes.string,
};

ShareComponent.defaultProps = {
    title: null,
};

export default translate(ShareComponent);