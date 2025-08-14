import {
  Alert,
  SafeAreaView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {common} from "../../theme/commonStyles";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";
import {SettingsStackParamList} from "../../navigation/SettingsNavigator";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {useUserStore} from "../../store/userStore";
import {styles} from "./styles";
import {UserAvatarCircle} from "../../components/UserAvatarCircle/UserAvatarCircle";
import {Next} from "../../assets/svg/Next";
import {COLORS} from "../../theme/colors";
import {useMemo} from "react";

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface SettingsItem {
  id: string;
  title: string;
  destination?: keyof SettingsStackParamList;
  action?: () => void | Promise<void>;
  isDestructive?: boolean;
  isProfile?: boolean;
}

interface SettingsSection {
  title: string;
  data: SettingsItem[];
}

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {user, logout} = useUserStore();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      {text: "Cancel", style: "cancel"},
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: "Auth"}],
            }),
          );
        },
      },
    ]);
  };

  const settingsData: SettingsSection[] = useMemo(
    () => [
      {
        title: "PROFILE",
        data: [
          {
            id: "profile",
            title: user?.username || "Profile",
            destination: "EditProfile",
            isProfile: true,
          },
        ],
      },
      {
        title: "GENERAL",
        data: [
          {
            id: "manage_friends",
            title: "Manage Friendships",
            destination: "ManageFriendships",
          },
          {
            id: "daily_goal",
            title: "Daily Focus Goal",
            destination: "DailyGoal",
          },
          {
            id: "notifications",
            title: "Turn on notifications",
          },
          {
            id: "blocked_apps",
            title: "Unlock Blocked Apps",
          },
        ],
      },
      {
        title: "SUPPORT CHATS",
        data: [
          {
            id: "issues_questions",
            title: "Issues & Questions",
          },
          {
            id: "feature_ideas",
            title: "Feature Ideas",
          },
          {
            id: "general_feedback",
            title: "General Feedback",
          },
        ],
      },
      {
        title: "FAQ",
        data: [
          {
            id: "faq1",
            title: "How can I manage my subscription?",
          },
          {
            id: "faq2",
            title: "What can I do with coins?",
          },
          {
            id: "faq3",
            title: "How can I earn coins?",
          },
          {
            id: "faq4",
            title: "Can i add time manually?",
          },
        ],
      },
      {
        title: "OTHER",
        data: [
          {
            id: "terms_conditions",
            title: "Terms & Conditions",
          },
          {
            id: "privacy_policy",
            title: "Privacy Policy",
          },
          {
            id: "logout",
            title: "Log Out",
            action: handleLogout,
            isDestructive: true,
          },
        ],
      },
    ],
    [user],
  );

  const handlePress = (item: SettingsItem) => {
    if (item.action) {
      item.action();
    }

    if (item.destination) {
      navigation.navigate(item.destination);
    }
  };

  const isItemPressable = (item: SettingsItem) => {
    return !!item.destination || !!item.action;
  };

  return (
    <SafeAreaView style={[commonScreenStyles.container]}>
      <View style={{paddingHorizontal: 22, flex: 1}}>
        <SectionList
          sections={settingsData}
          keyExtractor={(item) => item.id}
          renderItem={({item, index, section}) => {
            const pressable = isItemPressable(item);

            if (item.isProfile) {
              return (
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.profileButton,
                    {borderRadius: 9},
                  ]}
                  onPress={() => handlePress(item)}
                  disabled={!pressable}
                  activeOpacity={pressable ? 0.7 : 1}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <UserAvatarCircle
                      gradientColors={user?.avatarGradient || []}
                      style={{width: 35, height: 35}}
                    />
                    <Text
                      style={[
                        styles.buttonText,
                        !pressable && styles.disabledText,
                      ]}
                    >
                      {user ? user.username : "Profile"}
                    </Text>
                  </View>
                  <Next fill={COLORS.gray} width={15} height={11} />
                </TouchableOpacity>
              );
            }

            const isFirst = index === 0;
            const isLast = index === section.data.length - 1;
            const isOnlyOne = isFirst && isLast;

            const itemStyles = [
              styles.button,
              isOnlyOne && styles.buttonSingle,
              isFirst && !isLast && styles.buttonFirst,
              isLast && !isFirst && styles.buttonLast,
            ];

            return (
              <TouchableOpacity
                style={itemStyles}
                onPress={() => handlePress(item)}
                disabled={!pressable}
                activeOpacity={pressable ? 0.7 : 1}
              >
                {!isFirst && <View style={styles.separator} />}
                <Text
                  style={[
                    styles.buttonText,
                    item.isDestructive && styles.destructiveText,
                    !pressable && styles.disabledText,
                  ]}
                >
                  {item.title}
                </Text>
                {item.destination && (
                  <Next fill={COLORS.gray} width={15} height={11} />
                )}
              </TouchableOpacity>
            );
          }}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          ItemSeparatorComponent={() => null}
          SectionSeparatorComponent={() => null}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
