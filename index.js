'use strict';

import React, {
    PropTypes
} from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';

import styles from './style';
import BaseComponent from './BaseComponent';
const OPTION_CONTAINER_HEIGHT = 400;

let componentIndex = 0;

const propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    initValue: PropTypes.string,
    style: View.propTypes.style,
    selectStyle: View.propTypes.style,
    optionStyle: View.propTypes.style,
    optionTextStyle: Text.propTypes.style,
    sectionStyle: View.propTypes.style,
    sectionTextStyle: Text.propTypes.style,
    cancelStyle: View.propTypes.style,
    cancelTextStyle: Text.propTypes.style,
    overlayStyle: View.propTypes.style,
    cancelText: PropTypes.string,
    labelField: PropTypes.string,
    keyField: PropTypes.string
};

const defaultProps = {
    data: [],
    onChange: () => { },
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel',
    labelField: 'label',
    keyField: 'key'
};

export default class ModalPicker extends BaseComponent {

    constructor() {

        super();

        this._bind(
            'onChange',
            'open',
            'close',
            'renderChildren'
        );

        this.state = {
            animationType: 'slide',
            modalVisible: false,
            transparent: false,
            selected: 'please select'
        };
    }

    componentDidMount() {
        this.setState({ selected: this.props.initValue });
        this.setState({ cancelText: this.props.cancelText });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initValue != this.props.initValue) {
            this.setState({ selected: nextProps.initValue });
        }
    }

    onChange(item) {
        let labelField = this.props.labelField;
        this.props.onChange(item);
        this.setState({ selected: item[labelField] });
        this.close();
    }

    close() {
        this.setState({
            modalVisible: false
        });
    }

    open() {
        this.setState({
            modalVisible: true
        });
    }

    renderSection(section) {
        const { keyField} = this.props.keyField;
        return (
            <View key={section[keyField]} style={[styles.sectionStyle, this.props.sectionStyle]}>
                <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.label}</Text>
            </View>
        );
    }

    renderOption(option) {
        let labelField = this.props.labelField;
        const { keyField} = this.props.keyField;
        return (
            <TouchableOpacity key={option[keyField]} onPress={() => this.onChange(option) }>
                <View style={[styles.optionStyle, this.props.optionStyle]}>
                    <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>{option[labelField]}</Text>
                </View>
            </TouchableOpacity>)
    }

    renderOptionList() {
        var options = this.props.data.map((item) => {
            if (item.section) {
                return this.renderSection(item);
            } else {
                return this.renderOption(item);
            }
        });

        const {height, width} = Dimensions.get('window');
        const cancelView = (
            <View style={styles.cancelContainer}>
                <TouchableOpacity onPress={this.close}>
                    <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                        <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={[styles.overlayStyle, this.props.overlayStyle, { width, height }]} key={'modalPicker' + (componentIndex++) }>
                <View style={[styles.optionContainer, { top: (height - OPTION_CONTAINER_HEIGHT) / 2 + 10, width: width * 0.8 }]}>
                    <ScrollView keyboardShouldPersistTaps>
                        <View style={{ paddingHorizontal: 10 }}>
                            {options}
                        </View>
                    </ScrollView>
                </View>
                {cancelView}

            </View>);
    }

    renderChildren() {

        if (this.props.children) {
            return this.props.children;
        }
        return (
            <View style={[styles.selectStyle, this.props.selectStyle]}>
                <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
            </View>
        );
    }

    render() {

        const dp = (
            <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
                {this.renderOptionList() }
            </Modal>
        );

        return (
            <View style={this.props.style}>
                {dp}
                <TouchableOpacity onPress={this.open}>
                    {this.renderChildren() }
                </TouchableOpacity>
            </View>
        );
    }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
